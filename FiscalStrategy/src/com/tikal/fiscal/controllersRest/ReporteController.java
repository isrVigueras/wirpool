package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.controllersRest.VO.OrdenDeTrabajoVO;
import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.dao.MovimientoDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.reporting.ReporteOT;
import com.tikal.fiscal.security.UsuarioDAO;
import com.tikal.fiscal.util.AsignadorDeCharset;

@Controller
@RequestMapping(value={"reportes"})
public class ReporteController {
	
	@Autowired
	OrdenDeTrabajoDAO otdao;
	
	@Autowired
	ClienteDAO clientedao;
	
	@Autowired
	UsuarioDAO usuariodao;
	
	@Autowired
	MovimientoDAO movimientodao;
	
	@Autowired
	PagoRecibidoDAO pagodao;
	
	@RequestMapping(value={"reportes/{finicio}/{ffinal}"}, method= RequestMethod.GET, produces = "application/vnd.ms-excel")
	public void reporteFechas(HttpServletRequest req, HttpServletResponse res, @PathVariable String finicio, @PathVariable String ffinal) throws ParseException, UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		try {
			SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
			Date datei = formatter.parse(finicio);
			Date datef = formatter.parse(ffinal);
			Calendar c = Calendar.getInstance();
			c.setTime(datef);
			c.add(Calendar.DATE, 1);
			datef = c.getTime();
			List<OrdenDeTrabajo> lista= otdao.getFecha(datei, datef);
			List<OrdenDeTrabajoVO> listavo= new ArrayList<OrdenDeTrabajoVO>();
			for(OrdenDeTrabajo ot:lista){
				listavo.add(this.carga(ot));
			}
			
			HSSFWorkbook libro= ReporteOT.llenarReporte(listavo);
		
		
			libro.write(res.getOutputStream());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private OrdenDeTrabajoVO carga(OrdenDeTrabajo ot){
		OrdenDeTrabajoVO otvo= new OrdenDeTrabajoVO();
		
		if(ot.getIdCliente()!=null){
			Cliente cliente= clientedao.get(ot.getIdCliente());
			ot.setIdBrocker(cliente.getIdBrocker());
			//ot.setIdResponsable(cliente.getResponsable());
			otvo.setCliente(cliente);
		}
		if(ot.getIdBrocker()!=null){
			Cliente broker = clientedao.get(ot.getIdBrocker());
			otvo.setBroker(broker);
		}
		if(ot.getIdResponsable()!=null){
			Usuario u= usuariodao.consultarId(ot.getIdResponsable());
			if(u!=null){
				u.setPass("");
				otvo.setResponsable(u);
			}
		}
		
//		List<Movimiento> mov = movimientodao.getByIds(ot.getMovimientos());
//		otvo.setMovimientos(mov);
//		List<Movimiento> com = movimientodao.getByIds(ot.getComisiones());
//		otvo.setComisiones(com);
		
		List<PagoRecibido> pagos= pagodao.getPagosByOT(ot.getId());
		otvo.setPagos(pagos);
		otvo.setOt(ot);
		return otvo;
	}
}
