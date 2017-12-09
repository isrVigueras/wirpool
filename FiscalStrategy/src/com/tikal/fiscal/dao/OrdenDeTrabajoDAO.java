package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.OrdenDeTrabajo;

public interface OrdenDeTrabajoDAO {
	public void save(OrdenDeTrabajo ot);
	
	public void save(List<OrdenDeTrabajo> ots);
	
	public OrdenDeTrabajo get(Long id);
	
	public List<OrdenDeTrabajo> getByCliente(Long id, int page);
	
	public List<OrdenDeTrabajo> getByResponsable(Long id, int page);
	
	public int getPages(Long id);
	
}
