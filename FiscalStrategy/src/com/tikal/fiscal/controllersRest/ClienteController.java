
package com.tikal.fiscal.controllersRest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tikal.fiscal.controllersRest.VO.ClienteVO;
import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.dao.OrdenDeTrabajoDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.Usuario;
import com.tikal.fiscal.security.UsuarioDAO;
import com.tikal.fiscal.util.AsignadorDeCharset;
import com.tikal.fiscal.util.JsonConvertidor;

@Controller  
@RequestMapping(value={"/clientes"})
public class ClienteController {
	
	@Autowired
	ClienteDAO clientedao;
	
	@Autowired
	OrdenDeTrabajoDAO otdao;	
	
	@Autowired
	UsuarioDAO usuariodao;
	
	@RequestMapping(value={"/guardar"},method= RequestMethod.POST, consumes="application/json")
	public void guardar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		if(cliente.getApeMaterno()!=null){
			cliente.setNickname(cliente.getNombre()+" "+cliente.getApePaterno()+ " "+ cliente.getApeMaterno());
		}else{
			cliente.setNickname(cliente.getNombre()+" "+cliente.getApePaterno());
		}
		List<Cliente> lista=clientedao.buscar(cliente.getNombre());
		List<Cliente> repetidos= new ArrayList<Cliente>();
		if(lista.size()>0){
			for(Cliente c: lista){
				if(c.getNombre()!=null){
					if(c.getNombre().compareTo(cliente.getNombre())==0 && c.getApePaterno().compareTo(cliente.getApePaterno())==0){
						repetidos.add(c);
					}
				}
			}
		}
		if(repetidos.size()>0){
			res.getWriter().print(JsonConvertidor.toJson(repetidos));
		}else{
			clientedao.save(cliente);
			res.getWriter().print("OK");
		}
		
	}
	
	@RequestMapping(value={"/confirmar"},method= RequestMethod.POST, consumes="application/json")
	public void confirmar(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		cliente.setNickname(cliente.getNombre()+" "+cliente.getApePaterno()+ " "+ cliente.getApeMaterno());
		clientedao.save(cliente);
	}
	
	@RequestMapping(value={"/update"},method= RequestMethod.POST, consumes="application/json")
	public void update(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		if(cliente.getTipo().compareTo("cliente")==0){
			cliente.setNickname(cliente.getNombre()+" "+cliente.getApePaterno()+ " "+ cliente.getApeMaterno());
		}
		clientedao.save(cliente);
	}
	
	@RequestMapping(value={"/rehacer/{page}"},method= RequestMethod.GET, produces="application/json")
	public void rehacer(HttpServletResponse res, HttpServletRequest req, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
//		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
//		cliente.setNickname(cliente.getNombre()+" "+cliente.getApePaterno()+ " "+ cliente.getApeMaterno());}
		List<Cliente> lista= clientedao.getClientes(page+1, "cliente");
		for(Cliente cliente:lista){
			clientedao.save(cliente);
		}
	}
	
	@RequestMapping(value={"/getPagina/{page}"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req, @PathVariable int page) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista= clientedao.getClientes(page, "cliente");
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/getTotalPaginas"},method= RequestMethod.GET, produces="application/json")
	public void getPage(HttpServletResponse res, HttpServletRequest req) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		
		res.getWriter().print(clientedao.getPages("cliente"));
	}
	
	
	@RequestMapping(value={"/borrar"}, method= RequestMethod.POST, consumes="application/json")
	public void delete(HttpServletResponse res, HttpServletRequest req, @RequestBody String json) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		Cliente cliente= (Cliente) JsonConvertidor.fromJson(json, Cliente.class);
		if(!(otdao.getByCliente(cliente.getId()).size()>0)){
			clientedao.eliminar(cliente);
			res.getWriter().print("Eliminado con éxito");
		}else{
			res.getWriter().print("El cliente tiene Ordenes de trabajo asociadas");
		}
		
	}
	
	 
	@RequestMapping(value={"/buscar/{nombre}"},method= RequestMethod.GET, produces="application/json")
	public void buscar(HttpServletResponse res, HttpServletRequest req, @PathVariable String nombre) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista = clientedao.buscar(nombre);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/buscarFull/{nombre}"},method= RequestMethod.GET, produces="application/json")
	public void buscarFull(HttpServletResponse res, HttpServletRequest req, @PathVariable String nombre) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista = clientedao.buscar(nombre);
		lista.addAll(clientedao.buscarb(nombre));
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/getByBrocker/{id}"},method= RequestMethod.GET, produces="application/json")
	public void getByBrocker(HttpServletResponse res, HttpServletRequest req, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		List<Cliente> lista= clientedao.getByBrocker(id);
		res.getWriter().print(JsonConvertidor.toJson(lista));
	}
	
	@RequestMapping(value={"/find/{id}"},method= RequestMethod.GET, produces="application/json")
	public void getById(HttpServletResponse res, HttpServletRequest req, @PathVariable Long id) throws IOException{
		AsignadorDeCharset.asignar(req, res);
		ClienteVO vo= new ClienteVO();
		Cliente  c= clientedao.get(id);
		if(c.getIdBrocker()!=null){
			Cliente b= clientedao.get(c.getIdBrocker());
			vo.brocker=b;
		}
		if(c.getResponsable()!=null){
			Usuario r = usuariodao.consultarId(c.getResponsable());
			vo.responsable=r;
		}
		
		vo.cliente=c;

		res.getWriter().print(JsonConvertidor.toJson(vo));
	}
	
}
