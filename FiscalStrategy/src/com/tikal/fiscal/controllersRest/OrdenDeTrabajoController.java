package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/ots"})
public class OrdenDeTrabajoController {

	@Autowired
	OrdenDeTrabajoDAO otdao;	
	
	@RequestMapping(value={"/load/{page}"},method= RequestMethod.GET, produces="application/json")
	private void load(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		List<OrdenDeTrabajo> lista=null;
		if(user.getPerfil().compareTo("Ejecutivo")==0){
			lista=otdao.getByResponsable(user.getId(), page);
			res.getWriter().print(JsonConvertidor.toJson(lista));
		}else{
			if(user.getPerfil().compareTo("AdministradorRoot")==0){	
				lista=otdao.getFull(page);
				res.getWriter().print(JsonConvertidor.toJson(lista));
			}
		}
		
	}
	@RequestMapping(value={"/paginas"},method= RequestMethod.GET, produces="application/json")
	private void pages(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		
		Long id=this.isEjecutivo(req);
		res.getWriter().print(otdao.getPages(id));
	}
	
	
	@RequestMapping(value={"/find/{id}"},method= RequestMethod.GET, produces="application/json")
	private void find(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		OrdenDeTrabajo ot=otdao.get(id);
		res.getWriter().print(JsonConvertidor.toJson(ot));
		
	}
	
	@RequestMapping(value="/addMovimiento/{id}", method=RequestMethod.POST, consumes="application/json")
	private void addMovimiento(HttpServletRequest req, HttpServletResponse res, @RequestBody String json, @PathVariable Long id) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		OrdenDeTrabajo ot=otdao.get(id);
		Movimiento m= (Movimiento) JsonConvertidor.fromJson(json, Movimiento.class);
		m.setFecha(new Date());
		ot.getMovimientos().add(m);
		otdao.save(ot);
	}
	
	private Long isEjecutivo(HttpServletRequest req){
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Ejecutivo")==0){
			return user.getId();
		}
		return null;
	}
}
