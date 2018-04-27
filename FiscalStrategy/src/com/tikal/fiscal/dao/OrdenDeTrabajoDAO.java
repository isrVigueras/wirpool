package com.tikal.fiscal.dao;

import java.util.Date;
import java.util.List;

import com.tikal.fiscal.model.OrdenDeTrabajo;

public interface OrdenDeTrabajoDAO {
	public void save(OrdenDeTrabajo ot);
	
	public void save(List<OrdenDeTrabajo> ots);
	
	public OrdenDeTrabajo get(Long id);
	
	public List<OrdenDeTrabajo> getByCliente(Long id, int page);
	
	public List<OrdenDeTrabajo> getByCliente(Long id);
	
	public List<OrdenDeTrabajo> getByResponsable(Long id, int page);
	  
	public List<OrdenDeTrabajo> getFull(int page);
	
	public int getPages(Long id);
	
	public List<OrdenDeTrabajo> getFecha(Date fechaInicio, Date fechaFin);
	
	public List<OrdenDeTrabajo> getFechaCliente(Date fechaInicio, Date fechaFin, Long id);
	
	public List<OrdenDeTrabajo> getClienteCA(Long id);
	
}
