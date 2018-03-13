package com.tikal.fiscal.controllersRest;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.security.UsuarioDAO;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
public class ServicioSesion {

	@Autowired
	UsuarioDAO usuariodao;

	@RequestMapping(value = { "/user" }, method = RequestMethod.GET, produces = "application/json")
	public void user(HttpServletResponse res, HttpServletRequest req) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		String auti = req.getHeader("authorization");
		auti = auti.substring(5);
		byte[] dec = Base64Utils.decodeFromString(auti);

		String c = "";
		for (byte b : dec) {
			c += (char) b;
		}
		String[] parts = c.split(":");
		String u = parts[0];
		String p = UsuarioController.otroMetodo(parts[1]);
		Usuario usuario = usuariodao.consultarUsuario(u);
		// Verificar que el usuario y contraseña coincidan
		if (usuario == null || (usuario.getPassword().equals(p) == false)) {
			res.sendError(403);
		} else {
			usuario.resetPassword();
			req.getSession().setAttribute("userName", usuario.getUsername());
			req.getSession().setAttribute("user", usuario);
			res.getWriter().println(JsonConvertidor.toJson(usuario));
		}
	}

	// currentSession

	@RequestMapping(value = { "/currentSession" }, method = RequestMethod.GET, produces = "application/json")
	public void currentUser(HttpServletResponse res, HttpServletRequest req) throws IOException {
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		String n = (String) sesion.getAttribute("userName");
		if (n == null) {
			res.sendError(400);
		}else{
			res.getWriter().print(JsonConvertidor.toJson(user));
		}
	}
	
}

