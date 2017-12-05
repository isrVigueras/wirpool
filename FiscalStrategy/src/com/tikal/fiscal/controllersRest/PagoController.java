package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.controllersRest.VO.PagosMultiplesVO;
import com.tikal.fiscal.controllersRest.VO.PagosVO;
import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.dao.CuentaClienteDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.CuentaCliente;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.service.ParseadorDePagos;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value = { "/pagos" })
public class PagoController {

	@Autowired
	PagoRecibidoDAO pagosdao;

	@Autowired
	ClienteDAO clientedao;

	@Autowired
	CuentaClienteDAO cuentaclientedao;
	
	@Autowired
	OrdenDeTrabajoDAO otdao;

	@RequestMapping(value = { "/test" }, method = RequestMethod.GET)
	public void prueba(HttpServletResponse res) throws IOException {
		res.getWriter().println("Hola perrin");
	}

	@RequestMapping(value = { "/save" }, method = RequestMethod.POST, consumes = "application/json")
	public void guardaPagos(HttpServletResponse res, HttpServletRequest req, @RequestBody String json)
			throws IOException {
		AsignadorDeCharset.asignar(req, res);
		PagosVO pvo = (PagosVO) JsonConvertidor.fromJson(json, PagosVO.class);

		this.crearOTs(pvo.getPagos());
		pagosdao.save(pvo.getPagos());
	}

	@RequestMapping(value = { "/procesarMultiple" }, method = RequestMethod.POST, consumes = "application/json")
	public void multiple(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		PagosMultiplesVO pagos = (PagosMultiplesVO) JsonConvertidor.fromJson(json, PagosMultiplesVO.class);

		List<PagoRecibido> lista = ParseadorDePagos.parsear(pagos.getDatos(), pagos.getTipo(), pagos.getCuenta());
		pagosdao.save(lista);
		this.crearOTs(lista);
	}

	private void crearOTs(List<PagoRecibido> pagos){
		List<OrdenDeTrabajo> ots= new ArrayList<OrdenDeTrabajo>();
		for(PagoRecibido p:pagos){
			OrdenDeTrabajo ot = new OrdenDeTrabajo();
			ot.setEstatus("Activo");
			ot.setFechaInicio(p.getFecha());
			ot.setIdPago(p.getId());
			
			//cargar id de responsable del cliente
			ot.setIdResponsable(12L);
			ot.setResguardo(p.getMonto());
			ot.setTipo("Externa");
			CuentaCliente cuenta= cuentaclientedao.getByClabe(p.getClabe());
			if(cuenta!=null){
				Cliente c= clientedao.get(cuenta.getId_cliente());
				ot.setIdCliente(c.getId());
				p.setId_cliente(c.getId());
				ot.setIdBrocker(c.getIdBrocker());
				p.setId_brocker(c.getIdBrocker());
			}
			ots.add(ot);
		}
		otdao.save(ots);
		
	}
}
