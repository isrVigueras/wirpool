package com.tikal.fiscal.dao;

import java.util.Date;
import java.util.List;

import com.tikal.fiscal.model.Movimiento;

public interface MovimientoDAO {
	
	public void save(Movimiento m);
	 
	public Movimiento get(Long id);
	
	public List<Movimiento> getByOT(Long idOt);
	
	public List<Movimiento> getByIds(List<Long> ids);
	 
	public List<Movimiento> getFull(int page, String tipo); 
	
	public int getPages(Long id);
	
	public int getPagesCliente(Long id);
	
	public int numPages();
	
	public List<Movimiento> getPage(int page);
	
	public List<Movimiento> getPageByCliente(Long idCliente, int page);
	
	public List<Movimiento> getPageByEmpresa(String empresa, int page);
	
	public int getPagesEmpresa(String empresa);
	
	public List<Movimiento> getResguardos(Long id);
	
	public List<Movimiento> getResguardosFechas(Date finicio, Date fFinal);
	
}
