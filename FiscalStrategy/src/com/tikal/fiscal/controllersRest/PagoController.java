package com.tikal.fiscal.controllersRest;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.controllersRest.VO.PagosVO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
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
	}
}
