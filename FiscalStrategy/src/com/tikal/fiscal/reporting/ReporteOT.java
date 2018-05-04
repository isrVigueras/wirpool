package com.tikal.fiscal.reporting;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Font;

import com.tikal.fiscal.controllersRest.VO.OrdenDeTrabajoVO;
import com.tikal.fiscal.model.PagoRecibido;

public class ReporteOT {

	public static HSSFWorkbook llenarReporte(List<OrdenDeTrabajoVO> lista) {

		Map<String, List<OrdenDeTrabajoVO>> mapa = ReporteOT.crearMapa(lista);
		HSSFWorkbook workbook = new HSSFWorkbook();
		int numHoja=0;
		for (String key : mapa.keySet()) {
			
			HSSFSheet sheet = workbook.createSheet();
			workbook.setSheetName(numHoja, key);
			CellStyle styleCurrencyFormat = null;
			styleCurrencyFormat = workbook.createCellStyle();
			DataFormat format = workbook.createDataFormat();
			styleCurrencyFormat.setDataFormat(format.getFormat("#,###,##0.00"));

			String[] headers = new String[] { "#Orden", "Cliente", "Broker", "Empresa", "Emp. Depósito", "Banco",
					"Depósito", "Fecha", "Devolución", "Comisiones", "Costo J&A", "J&A" ,"Estatus"};
			CellStyle headerStyle = workbook.createCellStyle();
			Font font = workbook.createFont();
			font.setBoldweight(Font.BOLDWEIGHT_BOLD);
			headerStyle.setFont(font);
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
			
			sheet.createRow(1).createCell(2).setCellValue("REPORTE DIARIO DE OPERACIONES");
			sheet.createRow(5).createCell(0).setCellValue("Ejecutivo de operaciones: "+ key);
			sheet.createRow(6).createCell(0).setCellValue("Fecha: "+ formatter.format(new Date()));
			
			sheet.addMergedRegion(new CellRangeAddress(5, 5, 0, 3));
			sheet.addMergedRegion(new CellRangeAddress(6, 6, 0, 2));
			sheet.addMergedRegion(new CellRangeAddress(1, 1, 2, 4));
			

			

			HSSFRow headerRow = sheet.createRow(8);
			for (int i = 0; i < headers.length; ++i) {
				String header = headers[i];
				HSSFCell cell = headerRow.createCell(i);
				cell.setCellStyle(headerStyle);
				cell.setCellValue(header);
			}

			int rengInicio = 9;
			float sumaCosto=0;
			float sumaja=0;
			
			for (OrdenDeTrabajoVO ot : mapa.get(key)) {
				HSSFRow r = sheet.createRow(rengInicio);

				r.createCell(0).setCellValue(ot.getOt().getId());
				if (ot.getCliente().getNickname() != null) {
					r.createCell(1).setCellValue(ot.getCliente().getNickname());
				}
				if(ot.getBroker()!=null){
					if (ot.getBroker().getNickname() != null) {
						r.createCell(2).setCellValue(ot.getBroker().getNickname());
					}
				}
				float deposito= 0;
				if(ot.getPagos()!=null){
					if(ot.getPagos().size()>0){
						if (ot.getPagos().get(0).getEmpresa() != null) {
							r.createCell(3).setCellValue(ot.getPagos().get(0).getEmpresa());
							r.createCell(4).setCellValue(ot.getPagos().get(0).getEmpresa());
							r.createCell(5).setCellValue(ot.getPagos().get(0).getBanco());
						}
					}
					for(PagoRecibido pago: ot.getPagos()){
						deposito+= pago.getMonto();
					}
					HSSFCell celda6=r.createCell(6);
					celda6.setCellValue(deposito);
					celda6.setCellStyle(styleCurrencyFormat);
//					celda6.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
					
					
				}
				r.createCell(7).setCellValue(formatter.format(ot.getOt().getFechaInicio()));
				HSSFCell celda8= r.createCell(8);
				celda8.setCellValue(ot.getOt().getTotal());
				celda8.setCellStyle(styleCurrencyFormat);
				HSSFCell celda9= r.createCell(9);
				celda9.setCellStyle(styleCurrencyFormat);
				HSSFCell celda10= r.createCell(10);
				celda10.setCellStyle(styleCurrencyFormat);
				HSSFCell celda11= r.createCell(11);
				celda11.setCellStyle(styleCurrencyFormat);
				celda9.setCellValue(ot.getOt().getTotalComisiones());
				celda10.setCellValue(ot.getOt().getMontoDes());
				sumaCosto+= ot.getOt().getMontoDes();
				sumaja += ot.getOt().getMontoLic();
				celda11.setCellValue(ot.getOt().getMontoLic());
				r.createCell(12).setCellValue(ot.getOt().getEstatus().toUpperCase());
				rengInicio++;
			}
			
			HSSFRow sumaRow= sheet.createRow(rengInicio+1);
			sumaRow.createCell(9).setCellValue("Suma:");
			HSSFCell celdasuma1 = sumaRow.createCell(10);
			celdasuma1.setCellStyle(styleCurrencyFormat);
			celdasuma1.setCellValue(sumaCosto);
			
			HSSFCell celdasuma2 = sumaRow.createCell(11);
			celdasuma2.setCellStyle(styleCurrencyFormat);
			celdasuma2.setCellValue(sumaja);
			
			numHoja++;
			sheet.setColumnWidth(0, 10*256);
			sheet.setColumnWidth(1, 30*256);
			sheet.setColumnWidth(2, 30*256);
			sheet.setColumnWidth(3, 25*256);
			sheet.setColumnWidth(4, 20*256);
			sheet.setColumnWidth(5, 20*256);
			sheet.setColumnWidth(6, 16*256);
			sheet.setColumnWidth(7, 16*256);
			sheet.setColumnWidth(8, 16*256);
			sheet.setColumnWidth(9, 16*256);
			sheet.setColumnWidth(10, 16*256);
			sheet.setColumnWidth(11, 16*256);
			rengInicio++;
			
		}

		
		
		return workbook;
	}

	private static Map<String, List<OrdenDeTrabajoVO>> crearMapa(List<OrdenDeTrabajoVO> lista) {

		Map<String, List<OrdenDeTrabajoVO>> mapa = new HashMap<String, List<OrdenDeTrabajoVO>>();

		for (OrdenDeTrabajoVO ot : lista) {
			if(ot.getResponsable()!=null){
				String r = ot.getResponsable().getUsername();
				if (mapa.containsKey(r)) {
					mapa.get(r).add(ot);
				} else {
					List<OrdenDeTrabajoVO> l = new ArrayList<OrdenDeTrabajoVO>();
					l.add(ot);
					mapa.put(r, l);
				}
			}
		}

		return mapa;

	}

}
