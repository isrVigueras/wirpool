package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.tikal.fiscal.dao.ClienteDAO;
import com.tikal.fiscal.model.Cliente;

public class ClienteDAOImp implements ClienteDAO{

	@Override
	public void save(Cliente c) {
		ofy().save().entity(c).now();
	}

	@Override
	public Cliente get(Long id) {
		return ofy().load().type(Cliente.class).id(id).now();
	}

	@Override
	public List<Cliente> buscar(String nombre) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo","cliente").order("nickname").list();
		List<Cliente> result = new ArrayList<Cliente>();
		String c2 = nombre.substring(0, 1);
		for(int i =0; i< lista.size(); i++){
			Cliente c= lista.get(i);
			if(c.getNickname().toLowerCase().startsWith(nombre.toLowerCase())){
				result.add(c);
			}
			String c1= c.getNickname().substring(0, 1);
			
			if(c1.toLowerCase().compareTo(c2.toLowerCase())>0){
				break;
			}
		}
		return result;
	}

	@Override
	public List<Cliente> getClientes(int page, String tipo) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo",tipo).order("nickname").offset(25*(page-1)).limit(25).list();
		return lista;
	}

	@Override
	public void eliminar(Cliente c) { 
		c.setEnabled(false);
		this.save(c);
	}

	@Override
	public List<Cliente> getByBrocker(Long idbrocker) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo","cliente").filter("idBrocker",idbrocker).list();
		return lista;
	}

	@Override
	public List<Cliente> getTipo(String tipo) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo", tipo).list();
		return lista;
	}

	@Override
	public List<Cliente> getAll() {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).list();
		return lista;
	}

	@Override
	public int getPages(String tipo) {
		int total = ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo", tipo).count();
		
		return ((total-1)/25)+1;
	}

	@Override
	public List<Cliente> buscarb(String nombre) {
		List<Cliente> lista= ofy().load().type(Cliente.class).filter("enabled",true).filter("tipo","brocker").order("nickname").list();
		List<Cliente> result = new ArrayList<Cliente>();
		String c2 = nombre.substring(0, 1);
		for(int i =0; i< lista.size(); i++){
			Cliente c= lista.get(i);
			if(c.getNickname().toLowerCase().startsWith(nombre.toLowerCase())){
				result.add(c);
			}
			String c1= c.getNickname().substring(0, 1);
			
			if(c1.toLowerCase().compareTo(c2.toLowerCase())>0){
				break;
			}
		}
		return result;
	}

	@Override
	public List<Cliente> get(Long[] id) {
		Map<Long, Cliente> mapa= ofy().load().type(Cliente.class).ids(id);
		List<Cliente> lista= new ArrayList<Cliente>();
		lista.addAll(mapa.values());
		return lista;
	}

}
