package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.tikal.fiscal.controllersRest.VO.OrdenDeTrabajoVO;
import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.dao.CuentaDAO;
import com.tikal.fiscal.dao.FolioOtDAO;
import com.tikal.fiscal.dao.MovimientoDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.dao.PagoRecibidoDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.Cuenta;
import com.tikal.fiscal.model.FolioOT;
import com.tikal.fiscal.model.Movimiento;
import com.tikal.fiscal.model.OrdenDeTrabajo;
import com.tikal.fiscal.model.PagoRecibido;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.security.UsuarioDAO;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;
import com.tikal.fiscal.util.PDFot;

@Controller
@RequestMapping(value={"/ots"})
public class OrdenDeTrabajoController {
	
	@Autowired
	OrdenDeTrabajoDAO otdao;	
	
	@Autowired
	ClienteDAO clientedao;
	
	@Autowired
	PagoRecibidoDAO pagodao;
	
	@Autowired
	UsuarioDAO usuariodao;
	
	@Autowired
	MovimientoDAO movimientodao;
	
	@Autowired
	CuentaDAO cuentadao;
	
	@Autowired
	FolioOtDAO foliodao;
	
	@RequestMapping(value="/add/", method=RequestMethod.POST, consumes="application/json")
	private void crear(HttpServletRequest req, HttpServletResponse res, @RequestBody String json) throws UnsupportedEncodingException{
		AsignadorDeCharset.asignar(req, res);
		OrdenDeTrabajoVO otvo= (OrdenDeTrabajoVO) JsonConvertidor.fromJson(json, OrdenDeTrabajoVO.class);
		OrdenDeTrabajo ot= otvo.getOt();
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Ejecutivo")==0 || user.getPerfil().compareTo("AdministradorRoot")==0 || user.getPerfil().compareTo("AdministradorRoot")==0){
			ot.setIdResponsable(user.getId());
			ot.setFolioImpresion(1);
	
			FolioOT generaFolio = new FolioOT ();
			if(foliodao.getAll().size() > 0){
				List<FolioOT> numfolio = foliodao.getAll();
				generaFolio.setNoFolio(numfolio.get(0).getNoFolio() + 1);
				foliodao.save(generaFolio);
			}else{
				foliodao.save(generaFolio);
			}
	
			List<Movimiento> mM = otvo.getMovimientos();
			for(int i=0;i<mM.size();i++){
				mM.get(i).setFechaCreacion(new Date());
				movimientodao.save(mM.get(i));
				ot.getMovimientos().add(mM.get(i).getId());
			}
			List<Movimiento> mC = otvo.getComisiones();
			for(int i=0;i<mC.size();i++){
				mC.get(i).setFechaCreacion(new Date());
				movimientodao.save(mC.get(i));
				ot.getComisiones().add(mC.get(i).getId());
			}
			otdao.save(ot);
			
			List<PagoRecibido> pagos = otvo.getPagos();
			PagoRecibido pago;
			for(int i=0; i<pagos.size(); i++){
				pago= pagos.get(i);
				pago.setOt(ot.getId());
			}
			pagodao.save(pagos);
			
			if(otvo.getCliente() != null){
				Cliente cliente= otvo.getCliente();
				clientedao.save(cliente);
			}
			
			if(otvo.getBroker() != null){
				Cliente brocker= otvo.getBroker();
				clientedao.save(brocker);
			}
		}else{
			
		}
	}
	
	
	@RequestMapping(value={"/load/{page}"},method= RequestMethod.GET, produces="application/json")
	private void load(HttpServletRequest req, HttpServletResponse res, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		List<OrdenDeTrabajo> lista=null;
		if(user.getPerfil().compareTo("Ejecutivo")==0){
			lista=otdao.getByResponsable(user.getId(), page);
			res.getWriter().print(JsonConvertidor.toJson(lista));
		}else{
			if(user.getPerfil().compareTo("Administrador")==0 ){	
				lista=otdao.getFull(page);
				res.getWriter().print(JsonConvertidor.toJson(lista));
			}else{
				if(user.getPerfil().compareTo("AdministradorRoot")==0 ){
					lista=otdao.getFull(page);
					res.getWriter().print(JsonConvertidor.toJson(lista));
				}
			}
		}
		
	}
	@RequestMapping(value={"/paginas"},method= RequestMethod.GET, produces="application/json")
	private void pages(HttpServletRequest req, HttpServletResponse res) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Long id=this.isEjecutivo(req);
		res.getWriter().print(otdao.getPages(id));
	}
	
	
	@RequestMapping(value={"/find/{id}"},method= RequestMethod.GET, produces="application/json")
	private void find(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		OrdenDeTrabajo ot=otdao.get(id);
		OrdenDeTrabajoVO otvo= new OrdenDeTrabajoVO();
		
		if(ot.getIdCliente()!=null){
			Cliente cliente= clientedao.get(ot.getIdCliente());
			ot.setIdBrocker(cliente.getIdBrocker());
			ot.setIdResponsable(cliente.getResponsable());
			otvo.setCliente(cliente);
		}
		if(ot.getIdBrocker()!=null){
			Cliente broker = clientedao.get(ot.getIdBrocker());
			otvo.setBroker(broker);
		}
		if(ot.getIdResponsable()!=null){
			Usuario u= usuariodao.consultarId(ot.getIdResponsable());
			u.setPass("");
			otvo.setResponsable(u);
		}
		
		List<Movimiento> mov = movimientodao.getByIds(ot.getMovimientos());
		otvo.setMovimientos(mov);
		List<Movimiento> com = movimientodao.getByIds(ot.getComisiones());
		otvo.setComisiones(com);
		
		List<PagoRecibido> pagos= pagodao.getPagosByOT(ot.getId());
		otvo.setPagos(pagos);
		otvo.setOt(ot);
		res.getWriter().print(JsonConvertidor.toJson(otvo));
		
	} 
	
	@RequestMapping(value="/addMovimiento/", method=RequestMethod.POST, consumes="application/json")
	private void addMovimiento(HttpServletRequest req, HttpServletResponse res, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		OrdenDeTrabajoVO otvo= (OrdenDeTrabajoVO) JsonConvertidor.fromJson(json, OrdenDeTrabajoVO.class);
		OrdenDeTrabajo ot = otvo.getOt();
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Ejecutivo")==0 || user.getPerfil().compareTo("AdministradorRoot")==0){
				List<Movimiento> m = otvo.getMovimientos();
				for(int i=0; i<m.size();i++){
					if(m.get(i).getId() == null){
						m.get(i).setFechaCreacion(new Date());
						movimientodao.save(m.get(i));
						ot.getMovimientos().add(m.get(i).getId());
					}
				}
				List<Movimiento> c = otvo.getComisiones();
				for(int i=0; i<c.size();i++){
					if(c.get(i).getId() == null){
						c.get(i).setFechaCreacion(new Date());
						movimientodao.save(c.get(i));
						ot.getComisiones().add(c.get(i).getId());
					}
				}
				otdao.save(ot);
		}else{
			String error = "Usuario sin permisos para realizar esta accion";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}
	}
	
	private Long isEjecutivo(HttpServletRequest req){
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Ejecutivo")==0){
			return user.getId();
		}
		return null;
	}
	
	@RequestMapping(value = {"/descargaOt/{id}" }, method = RequestMethod.GET)
	public void pdfNota(HttpServletRequest req, HttpServletResponse res, @PathVariable Long id) throws IOException, DocumentException{
		AsignadorDeCharset.asignar(req, res);
		HttpSession sesion= req.getSession();
		Usuario user=(Usuario) sesion.getAttribute("user");
		if(user.getPerfil().compareTo("Ejecutivo")==0 || user.getPerfil().compareTo("AdministradorRoot")==0){
			res.setContentType("Application/PDF");
			OrdenDeTrabajoVO otvo=armaOTVO(id);
			List<PagoRecibido> pagos= otvo.getPagos();
			List<Cuenta> cuentas = new ArrayList<Cuenta>();
			for(int i=0; i<pagos.size(); i++){
				List<Cuenta> aux = cuentadao.getByCuenta(pagos.get(i).getCuenta());
				if(aux.size() > 0){
					cuentas.add(aux.get(0));
				}
			}
			PDFot pdf = new PDFot();
			PdfWriter writer = PdfWriter.getInstance(pdf.getDocument(), res.getOutputStream());
			pdf.getDocument().open();
			pdf.construirPdf(foliodao.get("1"), otvo, cuentas);
			pdf.getDocument().close();
			res.getOutputStream().flush();
			res.getOutputStream().close();
		}else{
			String error = "Usuario sin permisos para realizar esta accion";
			res.getWriter().print(JsonConvertidor.toJson(error));
		}
	}
	

	@RequestMapping(value={"/getClientesBrokers"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista= clientedao.getAll();
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	private OrdenDeTrabajoVO armaOTVO (Long id){
		OrdenDeTrabajo ot=otdao.get(id);
		OrdenDeTrabajoVO otvo= new OrdenDeTrabajoVO();
		
		if(ot.getFolioImpresion() > 0){
			int siguiente = ot.getFolioImpresion();
			siguiente++;
			ot.setFolioImpresion(siguiente);
			otdao.save(ot);
		}
		
		if(ot.getIdCliente()!=null){
			Cliente cliente= clientedao.get(ot.getIdCliente());
			ot.setIdBrocker(cliente.getIdBrocker());
			ot.setIdResponsable(cliente.getResponsable());
			otvo.setCliente(cliente);
		}
		
		if(ot.getIdBrocker()!=null){
			Cliente broker = clientedao.get(ot.getIdBrocker());
			otvo.setBroker(broker);
		}else{
			Cliente broker = new Cliente();
			broker.setNickname("No especificado");
			otvo.setBroker(broker);
		}
		if(ot.getIdResponsable()!=null){
			Usuario u= usuariodao.consultarId(ot.getIdResponsable());
			u.setPass("");
			otvo.setResponsable(u);
		}
		
		List<Movimiento> mov = movimientodao.getByIds(ot.getMovimientos());
		otvo.setMovimientos(mov);
		List<Movimiento> com = movimientodao.getByIds(ot.getComisiones());
		otvo.setComisiones(com);
		
		List<PagoRecibido> pagos= pagodao.getPagosByOT(ot.getId());
		otvo.setPagos(pagos);
		otvo.setOt(ot);		
		return otvo;
	}
}
