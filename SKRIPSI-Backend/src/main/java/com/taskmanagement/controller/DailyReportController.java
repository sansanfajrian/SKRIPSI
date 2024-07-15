package com.taskmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanagement.dto.CommonApiResponse;
import com.taskmanagement.dto.DailyReportRequestDTO;
import com.taskmanagement.dto.DailyReportResponseDTO;
import com.taskmanagement.security.CurrentUser;
import com.taskmanagement.security.UserPrincipal;
import com.taskmanagement.service.DailyReportService;

@RestController
@RequestMapping("api/dailyreport/")
@CrossOrigin(origins = "http://localhost:3000")
public class DailyReportController {
    @Autowired
    private DailyReportService dailyReportService;

    @GetMapping("fetch")
    ResponseEntity<List<DailyReportResponseDTO>> getAllDailyReports(Pageable page, @CurrentUser UserPrincipal currentUser) {
        try {
            List<DailyReportResponseDTO> getAllDailyReports = dailyReportService.getAllDailyReports(page);
            return ResponseEntity.ok(getAllDailyReports);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetch/employee")
    public ResponseEntity<List<DailyReportResponseDTO>> getDailyReportsByUser(Pageable page, @CurrentUser UserPrincipal currentUser) {
        try {
            List<DailyReportResponseDTO> dailyReportsByUser = dailyReportService.getDailyReportsByUserId(currentUser.getId(), page);
            return ResponseEntity.ok(dailyReportsByUser);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("add")
    ResponseEntity<CommonApiResponse> createDailyReport(@RequestBody DailyReportRequestDTO dailyReportDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            dailyReportDTO.setUserId(currentUser.getId());
            dailyReportService.createDailyReport(dailyReportDTO);
            response.setSuccess(true);
            response.setResponseMessage("Daily Report added successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while adding the Daily Report. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("get/{id}")
    ResponseEntity<DailyReportResponseDTO> getDailyReport(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        try {
            DailyReportResponseDTO getDailyReport = dailyReportService.getDailyReport(id);
            return ResponseEntity.ok(getDailyReport);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("edit/{id}")
    ResponseEntity<CommonApiResponse> upddateDailyReport(@PathVariable("id") int id, @RequestBody DailyReportRequestDTO dailyReportDTO, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            dailyReportDTO.setUserId(currentUser.getId());
            dailyReportService.updateDailyReport(id, dailyReportDTO);
            response.setSuccess(true);
            response.setResponseMessage("Daily Report edited successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while editing the Daily Report. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("delete/{id}")
    ResponseEntity<CommonApiResponse> deleteDailyReport(@PathVariable("id") int id, @CurrentUser UserPrincipal currentUser) {
        CommonApiResponse response = new CommonApiResponse();
        try {
            dailyReportService.deleteDailyReport(id);
            response.setSuccess(true);
            response.setResponseMessage("Daily Report deleted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setSuccess(false);
            response.setResponseMessage("An error occurred while deleting the Daily Report. " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
