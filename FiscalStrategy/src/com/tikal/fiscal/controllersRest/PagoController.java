package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.controllersRest.VO.PagosMultiplesVO;
import com.tikal.fiscal.controllersRest.VO.PagosVO;
import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.dao.CuentaClienteDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.dao.RegistroPagoDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.CuentaCliente;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.RegistroPago;
import com.tikal.fiscal.service.ParseadorDePagos;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value = { "/pagos" })
public class PagoController {

	@Autowired
	PagoRecibidoDAO pagosdao;
	
	@Autowired
	RegistroPagoDAO regpagodao;

	@Autowired
	ClienteDAO clientedao;

	@Autowired
	CuentaClienteDAO cuentaclientedao;

	@Autowired
	OrdenDeTrabajoDAO otdao;

	@RequestMapping(value = { "/eliminar" }, method = RequestMethod.POST, consumes = "application/json")
	public void eliminar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException {
		Long id= Long.parseLong(json);
		pagosdao.eliminar(id);
		res.getWriter().println("Pago Eliminado");
	}
	
	@RequestMapping(value = { "/buscar/{ref}" }, method = RequestMethod.GET)
	public void buscar(HttpServletResponse res, HttpServletRequest req,@PathVariable String ref) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		PagoRecibido pago= pagosdao.buscar(ref);
		res.getWriter().print(JsonConvertidor.toJson(pago));
	}

	@RequestMapping(value = { "/page/{page}" }, method = RequestMethod.GET)
	public void page(HttpServletResponse res, HttpServletRequest req,@PathVariable int page) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		List<RegistroPago> lista= regpagodao.getPagos(page);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value = { "/pages" }, method = RequestMethod.GET)
	public void pages(HttpServletResponse res, HttpServletRequest req) throws IOException {
		
		AsignadorDeCharset.asignar(req, res);
		
		res.getWriter().print(regpagodao.getPaginas());
	}
	
	@RequestMapping(value = { "/save" }, method = RequestMethod.POST, consumes = "application/json")
	public void guardaPagos(HttpServletResponse res, HttpServletRequest req, @RequestBody String json)
			throws IOException {
		AsignadorDeCharset.asignar(req, res);
		PagosVO pvo = (PagosVO) JsonConvertidor.fromJson(json, PagosVO.class);

		pagosdao.save(pvo.getPagos());
		this.crearOTs(pvo.getPagos());
		
	}

	@RequestMapping(value = { "/procesarMultiple" }, method = RequestMethod.POST, consumes = "application/json")
	public void multiple(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		PagosMultiplesVO pagos = (PagosMultiplesVO) JsonConvertidor.fromJson(json, PagosMultiplesVO.class);

		List<RegistroPago> lista = ParseadorDePagos.parsear(pagos.getDatos(), pagos.getTipo(), pagos.getCuenta());
		for (RegistroPago reg : lista) {
			PagoRecibido pago = pagosdao.buscar(reg.getReferencia());
			if(pago!=null){
				if(reg.getBanco().compareToIgnoreCase(pago.getBanco())==0 && reg.getEstatus()==null && pago.getMonto()== reg.getMonto() && reg.getCuenta().compareTo(pago.getCuenta())==0){
					pago.setValidado(true);
					pagosdao.save(pago);
				}
				
			}
		}
		
		regpagodao.save(lista);
//		this.crearOTs(lista);
	}

	private void crearOTs(List<PagoRecibido> pagos) {
		List<OrdenDeTrabajo> ots = new ArrayList<OrdenDeTrabajo>();
		for (PagoRecibido p : pagos) {
			OrdenDeTrabajo ot = new OrdenDeTrabajo();
			ot.setEstatus("Activo");
			ot.setFechaInicio(p.getFecha());
			ot.setIdPago(p.getId());


			double monto = Math.round(p.getMonto() * 100.0) / 100.0;
			ot.setResguardo(Float.parseFloat(monto + ""));
			ot.setTipo("Externa");
			Cliente c=null;
			if (p.getId() == null) {
				CuentaCliente cuenta = cuentaclientedao.getByClabe(p.getClabe());
				if (cuenta != null) {
					 c = clientedao.get(cuenta.getId_cliente());
				}
			}else{
				c= clientedao.get(p.getId_cliente());
			}
			if(c!=null){
					ot.setIdCliente(c.getId());
					p.setId_cliente(c.getId());
					ot.setIdBrocker(c.getIdBrocker());
					p.setId_brocker(c.getIdBrocker());
					ot.setIdResponsable(c.getResponsable());
					ot.setNombreCliente(c.getNickname());
			}
			ots.add(ot);
		}
		otdao.save(ots);

	}
}
