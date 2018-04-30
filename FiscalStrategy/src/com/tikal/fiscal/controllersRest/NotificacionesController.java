package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.tikal.fiscal.dao.NotificacionDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.Notificacion;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.security.UsuarioDAO;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/notificacion"})
public class NotificacionesController {

	@Autowired
	OrdenDeTrabajoDAO otdao;
	
	@Autowired
	UsuarioDAO usuariodao;
	
	@Autowired
	NotificacionDAO notificaciondao;
	
	
	@RequestMapping(value="/aAdministrador/", method=RequestMethod.POST, consumes="application/json")
	private void ejecutivo(HttpServletRequest req, HttpServletResponse res, @RequestBody String json ) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Notificacion notificacion = (Notificacion) JsonConvertidor.fromJson(json, Notificacion.class);
		Usuario us= usuariodao.consultarPorPerfil("Administrador");
		notificacion.setResponsabe(us.getId());
		notificaciondao.save(notificacion);
	}
	
	@RequestMapping(value="/aEjecutivo/", method=RequestMethod.POST, consumes="application/json")
	private void administrador(HttpServletRequest req, HttpServletResponse res, @RequestBody String json ) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Notificacion notificacion = (Notificacion) JsonConvertidor.fromJson(json, Notificacion.class);
		notificaciondao.save(notificacion);
	}
	
	@RequestMapping(value="/find/{id}", method=RequestMethod.GET, produces="application/json")
	private void find(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Notificacion notificacion = notificaciondao.getByID(id);
		if(notificacion == null){
			String error="Notificaciones no existentes";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}else{
			res.getWriter().print(JsonConvertidor.toJson(notificacion));
		}
	}

	@RequestMapping(value="/findByOt/{idOT}", method=RequestMethod.GET, produces="application/json")
	private void findByOt(HttpServletRequest req, HttpServletResponse res, @PathVariable Long idOT) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Notificacion> notificaciones = notificaciondao.getByOT(idOT);
		if(notificaciones == null){
			String error="Orden de Trabajo sin notificaciones pendientes";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}else{
			res.getWriter().print(JsonConvertidor.toJson(notificaciones));
		}
	}

	@RequestMapping(value="/findByResponsable/{idUser}", method=RequestMethod.GET, produces="application/json")
	private void findByResponsable(HttpServletRequest req, HttpServletResponse res, @PathVariable Long idUser) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Notificacion> notificaciones = notificaciondao.getByResponsable(idUser);
		if(notificaciones == null){
			String error="Usuario de Trabajo sin notificaciones pendientes";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}else{
			res.getWriter().print(JsonConvertidor.toJson(notificaciones));
		}
	}
	
	@RequestMapping(value = "/numAlertas/{idUser}", method = RequestMethod.GET, produces = "application/json")
	public void numAlertas(HttpServletRequest req, HttpServletResponse res, @PathVariable Long idUser) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Notificacion> lista= notificaciondao.getByResponsable(idUser);
		if(lista == null){
			String error="Usuario de Trabajo sin notificaciones pendientes";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}else{
			res.getWriter().print(lista.size());
		}
	}
	
	@RequestMapping(value="/deleteByID/{id}", method=RequestMethod.GET, produces="application/json")
	private void eliminaId(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Notificacion notificaciones = notificaciondao.getByID(id);
		notificaciondao.eliminar(notificaciones);
	}
	
	@RequestMapping(value="/deleteByOt/{idOT}", method=RequestMethod.GET, produces="application/json")
	private void elimina(HttpServletRequest req, HttpServletResponse res, @PathVariable Long idOt) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		List<Notificacion> notificaciones = notificaciondao.getByOT(idOt);
		notificaciondao.eliminarVarias(notificaciones);
	}
	
	@RequestMapping(value="/lanza/{idOT}", method=RequestMethod.GET)
	private void lanza(HttpServletRequest req, HttpServletResponse res, @PathVariable Long idOT) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Usuario> lista= usuariodao.consultarPorPerfilAll("Administrador");
		for(Usuario us:lista){
			Notificacion notificacion = new Notificacion();
			notificacion.setResponsabe(us.getId());
			notificacion.setIdOt(idOT);
			notificacion.setMensaje("Falta editar y validar movimientos");
			notificaciondao.save(notificacion);
		}
		res.getWriter().print("OK");
	}
	
	
}
