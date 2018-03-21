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

import com.tikal.fiscal.dao.CuentaDAO;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/cuentas"})
public class CuentaController {
	
	@Autowired
	CuentaDAO cuentadao;
	
	@RequestMapping(value={"/guardar"},method= RequestMethod.POST, consumes="application/json")
	public void guardar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		
		Cuenta cuenta= (Cuenta) JsonConvertidor.fromJson(json, Cuenta.class);
		cuenta.setEnabled(true);
		cuentadao.save(cuenta);
	}
	
	@RequestMapping(value={"/getPagina/{page}"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cuenta> lista= cuentadao.getPage(page);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/getNumPages"},method= RequestMethod.GET, produces="application/json")
	public void getNumPages(HttpServletResponse res, HttpServletRequest req) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		res.getWriter().print(cuentadao.getNumPages());
	}
	
	@RequestMapping(value={"/getTipo/{tipo}"},method= RequestMethod.GET, produces="application/json")
	public void getTipo(HttpServletResponse res, HttpServletRequest req, @PathVariable String tipo) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cuenta> lista= cuentadao.getByBanco(tipo);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/borrar"}, method= RequestMethod.POST, consumes="application/json")
	public void delete(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Cuenta cuenta= (Cuenta) JsonConvertidor.fromJson(json, Cuenta.class);
		cuentadao.eliminar(cuenta);
	}
	
}
