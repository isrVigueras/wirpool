package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.ArrayList;
import java.util.List;

import com.tikal.fiscal.dao.CuentaDAO;
import com.tikal.fiscal.model.Cuenta;

public class CuentaDAOImp implements CuentaDAO {

	@Override
	public void save(Cuenta c) {
		ofy().save().entity(c).now();
	}

	@Override
	public Cuenta get(Long id) {
		return ofy().load().type(Cuenta.class).id(id).now();
	}

	@Override
	public List<Cuenta> getPage(int page) {
		return ofy().load().type(Cuenta.class).filter("enabled",true).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public List<Cuenta> getByCliente(Long idCliente, int page) {
		return ofy().load().type(Cuenta.class).filter("idCliente",idCliente).filter("enabled",true).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public List<Cuenta> getByEjecutivo(Long idEjecutivo, int page) {
		return ofy().load().type(Cuenta.class).filter("enabled",true).filter("idResponsable",idEjecutivo).offset(25*(page - 1)).limit(25).list();
	}

	@Override
	public void eliminar(Cuenta c) {
		c.setEnabled(false);
		this.save(c);
	}

	@Override
	public List<Cuenta> getByBanco(String banco) {
		return ofy().load().type(Cuenta.class).filter("enabled",true).filter("banco",banco).list();
	}

	@Override
	public List<Cuenta> getByCuenta(String cuenta) {
		List<Cuenta> lista= ofy().load().type(Cuenta.class).filter("enabled",true).filter("cuenta", cuenta).list();
		if(lista.size()>0){
			return lista;
		}
		return new ArrayList<Cuenta>(); 
	}

	@Override
	public int getNumPages() {
		int total = ofy().load().type(Cuenta.class).filter("enabled",true).count();
		
		return ((total-1)/25)+1;
	}

	@Override
	public List<Cuenta> getByEmpresa(Long idEmpresa) {
		return ofy().load().type(Cuenta.class).filter("enabled",true).filter("idEmpresa", idEmpresa).list();
	}

}
