package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.OrdenDeTrabajo;

public interface OrdenDeTrabajoDAO {
	public void save(OrdenDeTrabajo ot);
	
	public OrdenDeTrabajo get(Long id);
	
	public List<OrdenDeTrabajo> getByCliente(Long id, int page);
	
	public List<OrdenDeTrabajo> getByResponsable(Long id, int page);
	
	public List<OrdenDeTrabajo> getPage(int page);
	
}
