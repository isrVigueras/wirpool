package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.Empresa;

public interface EmpresaDAO {
	void addEmpresa(Empresa e);
	void borraEmpresa(Empresa e);
	List<Empresa> buscar(String nombre);
	List<Empresa> consultar(int page);
	int numPages();
}
