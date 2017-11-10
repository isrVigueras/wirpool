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

import com.tikal.fiscal.controllersRest.VO.PagosVO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/pagos"})
public class PagoController {
	
	@Autowired 
	PagoRecibidoDAO pagosdao;
	
	@RequestMapping(value={"/test"}, method= RequestMethod.GET)
	public void prueba(HttpServletResponse res) throws IOException{
		res.getWriter().println("Hola perrin");
	}

	@RequestMapping(value={"/save"}, method= RequestMethod.POST, consumes="application/json")
	public void guardaPagos(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException{
		PagosVO pvo=(PagosVO) JsonConvertidor.fromJson(json, PagosVO.class);
		
		pagosdao.save(pvo.getPagos());
		this.crearOTs(pvo.getPagos());
	}
	
	private void crearOTs(List<PagoRecibido> pagos){
		List<OrdenDeTrabajo> ots= new ArrayList<OrdenDeTrabajo>();
		for(PagoRecibido p:pagos){
			OrdenDeTrabajo ot = new OrdenDeTrabajo();
			ot.setEstatus("Activo");
			ot.setFechaInicio(p.getFecha());
			ot.setIdBrocker(p.getId_brocker());
			ot.setIdCliente(p.getId_cliente());
			ot.setIdPago(p.getId());
			
			//cargar id de responsable del cliente
			ot.setIdResponsable(12L);
			ot.setResguardo(p.getMonto());
			ot.setTipo("Externa");
		}
		
	}
}
