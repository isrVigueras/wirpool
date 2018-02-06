package com.tikal.fiscal.dao;

import java.util.List;

import com.tikal.fiscal.model.FolioOT;

public interface FolioOtDAO {

	public void save(FolioOT folio);
	 
	public FolioOT get(String id);
	
	public List<FolioOT> getAll();

}
