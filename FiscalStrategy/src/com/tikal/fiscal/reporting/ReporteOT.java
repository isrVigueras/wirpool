package com.tikal.fiscal.reporting;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;

import com.tikal.fiscal.controllersRest.VO.OrdenDeTrabajoVO;

public class ReporteOT {

	public static HSSFWorkbook llenarReporte(List<OrdenDeTrabajoVO> lista) {

		Map<String, List<OrdenDeTrabajoVO>> mapa = ReporteOT.crearMapa(lista);
		HSSFWorkbook workbook = new HSSFWorkbook();
		int numHoja=0;
		for (String key : mapa.keySet()) {
			
			HSSFSheet sheet = workbook.createSheet();
			workbook.setSheetName(numHoja, key);
			HSSFCellStyle styleCurrencyFormat = null;
			styleCurrencyFormat = workbook.createCellStyle();
			styleCurrencyFormat.setDataFormat(HSSFDataFormat.getBuiltinFormat("$#'##0,##0.00"));

			String[] headers = new String[] { "#Orden", "Cliente", "Broker", "Empresa", "Emp. Depósito", "Banco",
					"Depósito", "Fecha", "Devolución", "Comisiones", "Costo J&A", "J&A" };
			CellStyle headerStyle = workbook.createCellStyle();
			Font font = workbook.createFont();
			font.setBoldweight(Font.BOLDWEIGHT_BOLD);
			headerStyle.setFont(font);

			sheet.addMergedRegion(new CellRangeAddress(5, 7, 2, 2));
			sheet.addMergedRegion(new CellRangeAddress(0, 3, 3, 3));

			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

			HSSFRow headerRow = sheet.createRow(8);
			for (int i = 0; i < headers.length; ++i) {
				String header = headers[i];
				HSSFCell cell = headerRow.createCell(i);
				cell.setCellStyle(headerStyle);
				cell.setCellValue(header);
			}

			int rengInicio = 9;

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
				if(ot.getPagos()!=null){
					if(ot.getPagos().size()>0){
						if (ot.getPagos().get(0).getEmpresa() != null) {
							r.createCell(3).setCellValue(ot.getPagos().get(0).getEmpresa());
							r.createCell(4).setCellValue(ot.getPagos().get(0).getEmpresa());
							r.createCell(5).setCellValue(ot.getPagos().get(0).getBanco());
						}
					}
				}
			}
			numHoja++;
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
