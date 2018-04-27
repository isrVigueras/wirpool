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
import com.tikal.fiscal.model.Movimiento;

public class ReporteMovimientos {
	
	public static HSSFWorkbook llenarReporte(List<Movimiento> lista){
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet();
		workbook.setSheetName(0, "Movimientos");
		HSSFCellStyle styleCurrencyFormat = null;
		styleCurrencyFormat=workbook.createCellStyle();
		styleCurrencyFormat.setDataFormat(HSSFDataFormat.getBuiltinFormat("$#'##0,##0.00"));

		String[] headers = new String[] { "#Orden","Tipo", "Empresa", "Banco", "Descripción", "Monto",
				"Fecha", "Estatus"};
		CellStyle headerStyle = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		headerStyle.setFont(font);

//		sheet.addMergedRegion(new CellRangeAddress(5,7,2,2));
//		sheet.addMergedRegion(new CellRangeAddress(0,3,3,3));
		
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		
        HSSFRow headerRow = sheet.createRow(1);
        for (int i = 0; i < headers.length; ++i) {
            String header = headers[i];
            HSSFCell cell = headerRow.createCell(i);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(header);
        }
        
        int rengInicio=2;
        
        
        
        
        for(Movimiento ot:lista){
        	if(ot.getIdOrden()!=null){
        	HSSFRow r = sheet.createRow(rengInicio);
	        	r.createCell(0).setCellValue(ot.getIdOrden());
	        	r.createCell(1).setCellValue(ot.getTipo());
	        	r.createCell(2).setCellValue(ot.getEmpresa());
	        	r.createCell(3).setCellValue(ot.getBanco());
	//        	r.createCell(4).setCellValue();
	        	r.createCell(4).setCellValue(ot.getDescripcion());
	        	r.createCell(5).setCellValue(ot.getMonto());
	        	r.createCell(6).setCellValue(formatter.format(ot.getFechaCreacion()));
	        	r.createCell(7).setCellValue(ot.getEstatus());
        	}
        	rengInicio++;
        }
        
        
        sheet.setColumnWidth(0, 20*256);
        sheet.setColumnWidth(1, 20*256);
        sheet.setColumnWidth(2, 20*256);
        sheet.setColumnWidth(3, 20*256);
        sheet.setColumnWidth(4, 40*256);
        sheet.setColumnWidth(5, 20*256);
        sheet.setColumnWidth(6, 20*256);
        sheet.setColumnWidth(7, 20*256);
        
        
		return workbook;
	}

}
