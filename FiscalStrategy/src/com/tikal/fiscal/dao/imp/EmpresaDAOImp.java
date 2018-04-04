package com.tikal.fiscal.dao.imp;

import java.util.ArrayList;
import java.util.List;
import static com.googlecode.objectify.ObjectifyService.ofy;
import com.tikal.fiscal.dao.EmpresaDAO;
import com.tikal.fiscal.model.Cliente;
import com.tikal.fiscal.model.Empresa;

public class EmpresaDAOImp implements EmpresaDAO{

	@Override
	public void addEmpresa(Empresa e) {
		ofy().save().entity(e).now();
	}

	@Override
	public void borraEmpresa(Empresa e) {
		ofy().delete().entity(e).now();
	}

	@Override
	public List<Empresa> buscar(String nombre) {
		List<Empresa> lista= ofy().load().type(Empresa.class).order("nombre").list();
		List<Empresa> result = new ArrayList<Empresa>();
		String c2 = nombre.substring(0, 1);
		for(int i =0; i< lista.size(); i++){
			Empresa c= lista.get(i);
			if(c.getNombre().toLowerCase().startsWith(nombre.toLowerCase())){
				result.add(c);
			}
			String c1= c.getNombre().substring(0, 1);
			
			if(c1.toLowerCase().compareTo(c2.toLowerCase())>0){
				break;
			}
		}
		return result;
	}

	@Override
	public List<Empresa> consultar(int page) {
		
		return ofy().load().type(Empresa.class).order("nombre").offset((page-1)*25).limit(25).list();
	}

	@Override
	public int numPages() {
		int total= ofy().load().type(Empresa.class).count();
		return ((total-1)/25)+1;
	}

	@Override
	public Empresa find(Long id) {
		return ofy().load().type(Empresa.class).id(id).now();
	}

}
