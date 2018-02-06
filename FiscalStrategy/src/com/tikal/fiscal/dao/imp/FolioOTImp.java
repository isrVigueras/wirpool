package com.tikal.fiscal.dao.imp;

import static com.googlecode.objectify.ObjectifyService.ofy;

import java.util.List;

import com.tikal.fiscal.dao.FolioOtDAO;
import com.tikal.fiscal.model.FolioOT;

public class FolioOTImp implements FolioOtDAO{

	@Override
	public void save(FolioOT folio) {
		ofy().save().entity(folio).now();
	}

	@Override
	public FolioOT get(String id) {
		return ofy().load().type(FolioOT.class).id(id).now();
	}

	@Override
	public List<FolioOT> getAll() {
		return ofy().load().type(FolioOT.class).list();
	}
	
	


}
