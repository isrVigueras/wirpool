package com.tikal.fiscal.controllersRest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.OrdenDeTrabajo;

@Controller
@RequestMapping(value={"reportes"})
public class ReporteController {
	
	@Autowired
	OrdenDeTrabajoDAO otdao;
	
	@RequestMapping(value={"reportes"}, method= RequestMethod.POST, produces = "application/vnd.ms-excel", consumes="application/json")
	public void reporteFechas(HttpServletRequest req, HttpServletResponse res, @RequestBody String json) throws ParseException{
		String[] fechas =json.split(",");
		SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
		Date datei = formatter.parse(fechas[0]);
		Date datef = formatter.parse(fechas[1]);
		List<OrdenDeTrabajo> lista= otdao.getFecha(datei, datef);
	}
}
