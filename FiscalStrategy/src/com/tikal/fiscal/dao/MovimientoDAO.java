package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Movimiento;

public interface MovimientoDAO {
	
	public void save(Movimiento m);
	 
	public Movimiento get(Long id);
	
	public List<Movimiento> getByOT(Long idOt);
	
	public List<Movimiento> getByIds(List<Long> ids);
	
	public List<Movimiento> getFull(int page);
	
	public int getPages(Long id);
	
}
