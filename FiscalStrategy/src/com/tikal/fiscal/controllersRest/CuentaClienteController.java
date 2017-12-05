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

import com.tikal.fiscal.dao.CuentaClienteDAO;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.CuentaCliente;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/cuentasCliente"})
public class CuentaClienteController {

	@Autowired
	CuentaClienteDAO cuentadao;
	
	@RequestMapping(value={"/guardar/{id}"},method= RequestMethod.POST, consumes="application/json")
	public void guardar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json, @PathVariable Long id) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		CuentaCliente cuenta= (CuentaCliente) JsonConvertidor.fromJson(json, CuentaCliente.class);
		cuenta.setId_cliente(id);
		cuentadao.save(cuenta);
	}
	
	@RequestMapping(value={"/todas/{id}"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<CuentaCliente> lista= cuentadao.getByCliente(id);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/borrar"}, method= RequestMethod.POST, consumes="application/json")
	public void delete(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		CuentaCliente cuenta= (CuentaCliente) JsonConvertidor.fromJson(json, CuentaCliente.class);
		cuentadao.eliminar(cuenta);
	}
	
}
