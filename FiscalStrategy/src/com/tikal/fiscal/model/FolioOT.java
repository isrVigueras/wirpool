package com.tikal.fiscal.model;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class FolioOT {
	
	@Id
	private String id ;
	private Long noFolio;
	
	public FolioOT() {
		this.id = "1";
		this.noFolio = 1L;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getNoFolio() {
		return noFolio;
	}

	public void setNoFolio(Long noFolio) {
		this.noFolio = noFolio;
	}

}
