package com.tikal.fiscal.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;

public class JsonConvertidor {
	public static Object fromJson(String json, Class<?> clase){
		Gson g;
//		if (clase.equals(RegimenVO.class)) {
//			g = getGsonWithSpecificTypeAdapter(clase, new RegimenAdapter());
//		} else if (clase.equals(ListaPagosVO.class)) {
//			g = getGsonWithSpecificTypeAdapter(clase, new ListaPagosVOAdapter());
//		} else if (clase.equals(Comprobante.class) || clase.equals(com.tikal.cacao.sat.cfd.Comprobante.class)
//				|| clase.equals(FacturaRO.class) || clase.equals(ComprobanteVO.class)
//				|| clase.equals(ComprobanteConComentarioVO.class)
//				|| clase.equals(ComprobanteDeNominaVO.class)) {
//			GsonBuilder gsonBuilder = new GsonBuilder();
//			gsonBuilder.registerTypeAdapter(XMLGregorianCalendar.class, new XMLGregorianCalendarConverter.Deserializer());
//			g = gsonBuilder.create();
//		} else {
			g= new Gson();
//		}
		
		return g.fromJson(json,clase);
	}
	
	public static String toJson(Object o){
		Gson g= new Gson();
		return g.toJson(o);
	}
	
	public static String estadoFromJson(String json) {
		int indexIni = json.indexOf("estado")+9;
		int indexFin = json.indexOf("localidad")-3;
		String estado = json.substring(indexIni, indexFin);
		return estado;
		 
	}
	
	static Gson getGsonWithSpecificTypeAdapter(Class<?> clase, TypeAdapter<?> adapter) {
		GsonBuilder gBuilder = new GsonBuilder();
		gBuilder.registerTypeAdapter(clase, adapter.nullSafe());
		return gBuilder.create();
	}
	

	
}
