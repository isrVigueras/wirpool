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

import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/brockers"})
public class BrockerController {
	
	@Autowired
	ClienteDAO clientedao;
	
	@RequestMapping(value={"/guardar"},method= RequestMethod.POST, consumes="application/json")
	public void guardar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		clientedao.save(cliente);
		
	}
	
	@RequestMapping(value={"/getPagina/{page}"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista= clientedao.getClientes(page, "brocker");
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/borrar"}, method= RequestMethod.POST, consumes="application/json")
	public void delete(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		clientedao.eliminar(cliente);
	}

	@RequestMapping(value={"/todos"},method= RequestMethod.GET, produces="application/json")
	public void getTodos(HttpServletResponse res, HttpServletRequest req) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista= clientedao.getTipo("brocker");
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
}
