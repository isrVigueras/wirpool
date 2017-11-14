package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller
@RequestMapping(value={"/ots"})
public class OrdenDeTrabajoController {

	@Autowired
	OrdenDeTrabajoDAO otdao;	
	
	@RequestMapping(value={"/load/{page}"},method= RequestMethod.GET, produces="application/json")
	private void load(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		List<OrdenDeTrabajo>lista=otdao.getPage(page);
		res.getWriter().print(JsonConvertidor.toJson(lista));
		
	}
	@RequestMapping(value={"/paginas"},method= RequestMethod.GET, produces="application/json")
	private void pages(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		List<OrdenDeTrabajo>lista=otdao.getPage(page);
		int pages= lista.size()/25;
		pages++;
		res.getWriter().print(pages);
	}
	
	
	@RequestMapping(value={"/find/{id}"},method= RequestMethod.GET, produces="application/json")
	private void find(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException{
		OrdenDeTrabajo ot=otdao.get(id);
		res.getWriter().print(JsonConvertidor.toJson(ot));
		
	}
}
