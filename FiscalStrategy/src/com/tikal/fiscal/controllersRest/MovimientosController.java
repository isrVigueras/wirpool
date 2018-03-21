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

import com.tikal.fiscal.controllersRest.VO.MovimientosVO;
import com.tikal.fiscal.dao.MovimientoDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/movimientos"})
public class MovimientosController {
	     
	@Autowired
	OrdenDeTrabajoDAO otdao;	
	
	@Autowired 
	MovimientoDAO movimientodao;
	
	@RequestMapping(value={"/load/{page}"},method= RequestMethod.GET, produces="application/json")
	private void load(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		List<Movimiento> lista=null;
		if(user.getPerfil().compareTo("Caja")==0 || user.getPerfil().compareTo("AdministradorRoot")==0){	
				lista=movimientodao.getFull(page, "Efectivo");
				res.getWriter().print(JsonConvertidor.toJson(lista));
		}else{
			String error = "Usuario sin permisos para realizar esta accion";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}
	}
	
	@RequestMapping(value={"/paginas"},method= RequestMethod.GET, produces="application/json")
	private void pages(HttpServletRequest req, HttpServletResponse res) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Long id=this.isCaja(req);
		res.getWriter().print(movimientodao.getPages(id));
	}
	
	@RequestMapping(value={"/find/{id}"},method= RequestMethod.GET, produces="application/json")
	private void find(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Movimiento mov=movimientodao.get(id);
		res.getWriter().print(JsonConvertidor.toJson(mov));	
	}
	
	@RequestMapping(value="/update/", method=RequestMethod.POST, consumes="application/json")
	private void update(HttpServletRequest req, HttpServletResponse res, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Movimiento mov= (Movimiento) JsonConvertidor.fromJson(json, Movimiento.class);
		movimientodao.save(mov);
	}
	

	@RequestMapping(value="/cancelar/", method=RequestMethod.POST, consumes="application/json")
	private void cancelar(HttpServletRequest req, HttpServletResponse res, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		MovimientosVO m= (MovimientosVO) JsonConvertidor.fromJson(json, MovimientosVO.class);
	//	movimientodao.save(mov);
		
		if(user.getPerfil().compareTo("Ejecutivo")==0 || user.getPerfil().compareTo("AdministradorRoot")==0 || user.getPerfil().compareTo("Administrador")==0){
			Movimiento mov= m.getMovimiento();
			OrdenDeTrabajo ot = otdao.get(m.getIdOt());
			
			if(m.getBndMovimiento().compareTo("cliente")==0){
					mov.setFechaCreacion(new Date());
					movimientodao.save(mov);
					ot.getMovimientos().add(mov.getId());
					ot.setSaldoMov(m.getSaldo());
			}
			if(m.getBndMovimiento().compareTo("asesor")==0){
				mov.setFechaCreacion(new Date());
				movimientodao.save(mov);
				ot.getComisiones().add(mov.getId());
				ot.setSaldoCom(m.getSaldo());
			}
			otdao.save(ot);
		}else{
			String error = "Usuario sin permisos para realizar esta accion";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}
	}
	private Long isCaja(HttpServletRequest req){
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Caja")==0){
			return user.getId();
		}
		return null;
	}
	
	

}
