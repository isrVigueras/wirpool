package com.tikal.fiscal.reporting;

import java.text.SimpleDateFormat;
import java.util.List;

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
	
	public static HSSFWorkbook llenarReporte(List<OrdenDeTrabajoVO> lista){
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet();
		workbook.setSheetName(0, "Hoja excel");
		HSSFCellStyle styleCurrencyFormat = null;
		styleCurrencyFormat=workbook.createCellStyle();
		styleCurrencyFormat.setDataFormat(HSSFDataFormat.getBuiltinFormat("$#'##0,##0.00"));

		String[] headers = new String[] { "#Orden", "Cliente", "Broker","Empresa", "Emp. Depósito", "Banco",
				"Depósito", "Fecha", "Devolución", "Comisiones", "Costo J&A","J&A"};
		CellStyle headerStyle = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		headerStyle.setFont(font);

		sheet.addMergedRegion(new CellRangeAddress(5,7,2,2));
		sheet.addMergedRegion(new CellRangeAddress(0,3,3,3));
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		
        HSSFRow headerRow = sheet.createRow(8);
        for (int i = 0; i < headers.length; ++i) {
            String header = headers[i];
            HSSFCell cell = headerRow.createCell(i);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(header);
        }
        
        int rengInicio=9;
        
        
        for(OrdenDeTrabajoVO ot:lista){
        	HSSFRow r = sheet.createRow(rengInicio);
        	
        	
        	
        	r.createCell(0).setCellValue(ot.getOt().getId());
        	r.createCell(1).setCellValue(ot.getCliente().getNickname());
        	r.createCell(2).setCellValue(ot.getBroker().getNickname());
        	r.createCell(3).setCellValue(ot.getPagos().get(0).getCuenta());
//        	r.createCell(4).setCellValue();
        }
        
        
		
		return workbook;
	}

}
