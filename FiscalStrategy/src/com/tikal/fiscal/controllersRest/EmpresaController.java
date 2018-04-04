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

import com.tikal.fiscal.controllersRest.VO.EmpresaCuentasVO;
import com.tikal.fiscal.dao.CuentaDAO;
import com.tikal.fiscal.dao.EmpresaDAO;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.Empresa;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/empresa"})
public class EmpresaController {
	
	@Autowired
	EmpresaDAO empresadao;
	
	@Autowired
	CuentaDAO cuentadao;
	
	@RequestMapping(value={"/guardar"},method= RequestMethod.POST, consumes="application/json")
	public void guardar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Empresa e= (Empresa) JsonConvertidor.fromJson(json, Empresa.class);
		empresadao.addEmpresa(e);
		
	}
	
	@RequestMapping(value={"/eliminar"},method= RequestMethod.POST, consumes="application/json")
	public void eliminar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		Empresa e= (Empresa) JsonConvertidor.fromJson(json, Empresa.class);
		empresadao.borraEmpresa(e);
		
	}
	
	
	@RequestMapping(value={"/consultar/{page}"},method= RequestMethod.GET, produces="application/json")
	public void consultar(HttpServletResponse res, HttpServletRequest req, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Empresa> lista = empresadao.consultar(page);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	
	@RequestMapping(value={"/numPages"},method= RequestMethod.GET, produces="application/json")
	public void numPages(HttpServletResponse res, HttpServletRequest req) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		res.getWriter().print(empresadao.numPages());
	}
	@RequestMapping(value={"/buscar/{nombre}"},method= RequestMethod.GET, produces="application/json")
	public void buscar(HttpServletResponse res, HttpServletRequest req, @PathVariable String nombre) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Empresa> lista = empresadao.buscar(nombre);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/getEmpresa/{id}"},method= RequestMethod.GET, produces="application/json")
	public void get(HttpServletResponse res, HttpServletRequest req, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Empresa e= empresadao.find(id); 
		List<Cuenta> cuentas = cuentadao.getByEmpresa(id);
		EmpresaCuentasVO vo= new EmpresaCuentasVO();
		vo.setEmpresa(e);
		vo.setCuentas(cuentas);
		res.getWriter().println(JsonConvertidor.toJson(vo));
	}
}
