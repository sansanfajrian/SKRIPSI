package com.taskmanagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.taskmanagement.dao.BacklogDao;
import com.taskmanagement.dao.DailyReportDao;
import com.taskmanagement.dao.ProjectDao;
import com.taskmanagement.dao.SprintDao;
import com.taskmanagement.dao.UserDao;
import com.taskmanagement.dto.DailyReportRequestDTO;
import com.taskmanagement.dto.DailyReportResponseDTO;
import com.taskmanagement.entity.Backlog;
import com.taskmanagement.entity.DailyReport;
import com.taskmanagement.entity.Project;
import com.taskmanagement.entity.Sprint;
import com.taskmanagement.entity.User;

@Service
public class DailyReportService {

    @Autowired
    private DailyReportDao dailyReportRepository;

    @Autowired
    private ProjectDao projectRepository;

    @Autowired
    private SprintDao sprintRepository;

    @Autowired
    private BacklogDao backlogRepository;

    @Autowired
    private UserDao userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<DailyReportResponseDTO> getAllDailyReports(Pageable page) {
        Page<DailyReport> dailyReportPage = dailyReportRepository.findAll(page);
        return dailyReportPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DailyReportResponseDTO> getDailyReportsByUserId(int userId, Pageable page) {
        Page<DailyReport> dailyReports = dailyReportRepository.findByUserId(userId, page);
        List<DailyReportResponseDTO> dailyReportDTOs = dailyReports.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return dailyReportDTOs;
    }

    public DailyReportResponseDTO getDailyReport(int dailyReportId) {
        DailyReport dailyReport = dailyReportRepository.findById(dailyReportId)
            .orElseThrow(() -> new EntityNotFoundException("DailyReport not found"));
        return convertToDTO(dailyReport);
    }

    @Transactional
    public DailyReportResponseDTO createDailyReport(DailyReportRequestDTO dailyReportDTO) {
        DailyReport newDailyReport = modelMapper.map(dailyReportDTO, DailyReport.class);
        newDailyReport.setProject(findProjectById(dailyReportDTO.getProjectId()));
        newDailyReport.setSprint(findSprintById(dailyReportDTO.getSprintId()));
        newDailyReport.setBacklog(findBacklogById(dailyReportDTO.getBacklogId()));
        newDailyReport.setUser(findUserById(dailyReportDTO.getUserId()));

        // Set rlzPicId based on User ID
        newDailyReport.getBacklog().setRlzPicId(newDailyReport.getUser().getId());

        // Calculate cumulative efforts
        float acmActEffort = calculateCumulativeActEffort(dailyReportDTO.getBacklogId(), dailyReportDTO.getActEffort());
        float acmAddEffort = calculateCumulativeAddEffort(dailyReportDTO.getBacklogId(), dailyReportDTO.getAddEffort());
        newDailyReport.setAcmActEffort(acmActEffort);
        newDailyReport.setAcmAddEffort(acmAddEffort);

        // Set estEffort from Backlog
        newDailyReport.setEstEffort(newDailyReport.getBacklog().getEstEffort());

        // Calculate currTaskProgress and initTaskProgress
        float currTaskProgress = calculateCurrTaskProgress(newDailyReport);
        float initTaskProgress = calculateInitTaskProgress(newDailyReport);
        newDailyReport.setCurrTaskProgress(currTaskProgress);
        newDailyReport.setInitTaskProgress(initTaskProgress);

        // Update Backlog
        updateBacklog(newDailyReport.getBacklog(), newDailyReport);

        newDailyReport = dailyReportRepository.save(newDailyReport);
        return convertToDTO(newDailyReport);
    }

    @Transactional
    public DailyReportResponseDTO updateDailyReport(int dailyReportId, DailyReportRequestDTO dailyReportDTO) {
        DailyReport existingDailyReport = dailyReportRepository.findById(dailyReportId)
                .orElseThrow(() -> new EntityNotFoundException("DailyReport not found"));

        // Store old values for Backlog update
        float oldAddEffort = existingDailyReport.getAddEffort();
        float oldActEffort = existingDailyReport.getActEffort();

        // Update fields
        modelMapper.map(dailyReportDTO, existingDailyReport);

        // Set rlzPicId based on User ID
        existingDailyReport.getBacklog().setRlzPicId(existingDailyReport.getUser().getId());

        // Recalculate cumulative efforts
        float acmActEffort = calculateCumulativeActEffort(dailyReportDTO.getBacklogId(), dailyReportDTO.getActEffort());
        float acmAddEffort = calculateCumulativeAddEffort(dailyReportDTO.getBacklogId(), dailyReportDTO.getAddEffort());
        existingDailyReport.setAcmActEffort(acmActEffort);
        existingDailyReport.setAcmAddEffort(acmAddEffort);

        // Set estEffort from Backlog
        existingDailyReport.setEstEffort(existingDailyReport.getBacklog().getEstEffort());

        // Recalculate currTaskProgress and initTaskProgress
        float currTaskProgress = calculateCurrTaskProgress(existingDailyReport);
        float initTaskProgress = calculateInitTaskProgress(existingDailyReport);
        existingDailyReport.setCurrTaskProgress(currTaskProgress);
        existingDailyReport.setInitTaskProgress(initTaskProgress);

        // Update Backlog
        updateBacklog(existingDailyReport.getBacklog(), existingDailyReport, oldAddEffort, oldActEffort);

        existingDailyReport = dailyReportRepository.save(existingDailyReport);
        return convertToDTO(existingDailyReport);
    }

    public void deleteDailyReport(int dailyReportId) {
        DailyReport dailyReport = dailyReportRepository.findById(dailyReportId)
                .orElseThrow(() -> new EntityNotFoundException("DailyReport not found"));
        dailyReportRepository.delete(dailyReport);
    }

    private float calculateCurrTaskProgress(DailyReport dailyReport) {
        float estEffort = dailyReport.getEstEffort();
        float acmActEffort = dailyReport.getAcmActEffort();
        float acmAddEffort = dailyReport.getAcmAddEffort();

        if (estEffort + acmAddEffort == 0) {
            return 0;
        }

        return (acmActEffort / (estEffort + acmAddEffort)) * 100;
    }

    private float calculateInitTaskProgress(DailyReport dailyReport) {
        float estEffort = dailyReport.getEstEffort();
        float initActEffort = dailyReport.getActEffort();
        float acmActEffort = dailyReport.getAcmActEffort();
        float acmAddEffort = dailyReport.getAcmAddEffort();

        if (estEffort + acmAddEffort == 0) {
            return 0;
        }

        return ((acmActEffort - initActEffort) / (estEffort + acmAddEffort)) * 100;
    }

    private void updateBacklog(Backlog backlog, DailyReport dailyReport) {
        updateBacklog(backlog, dailyReport, 0, 0);
    }

    @Transactional
    public void updateBacklogDoneDate(int backlogId) {
        Backlog backlog = backlogRepository.findById(backlogId)
                .orElseThrow(() -> new EntityNotFoundException("Backlog not found"));

        // Update doneDate only if prog reaches 100
        if (backlog.getProg() >= 100 && backlog.getDoneDate() == null) {
            String todayString = LocalDate.now().toString();
            backlog.setDoneDate(todayString);  // Set current date as doneDate
            backlogRepository.save(backlog);
        }
    }

    private void updateBacklog(Backlog backlog, DailyReport dailyReport, float oldAddEffort, float oldActEffort) {
        backlog.setAddEffort(backlog.getAddEffort() - oldAddEffort + dailyReport.getAddEffort());
        backlog.setActEffort(backlog.getActEffort() - oldActEffort + dailyReport.getActEffort());

        // Calculate Backlog progress
        float backlogProgress = calculateBacklogProgress(backlog);
        backlog.setProg(backlogProgress);

        // Update Backlog status based on progress
        updateBacklogStatus(backlog);

        updateBacklogDoneDate(backlog.getId());

        backlogRepository.save(backlog);
    }

    private float calculateBacklogProgress(Backlog backlog) {
        float estEffort = backlog.getEstEffort();
        float addEffort = backlog.getAddEffort();
        float actEffort = backlog.getActEffort();

        if (estEffort + addEffort == 0) {
            return 0;
        }

        return (actEffort / (estEffort + addEffort)) * 100;
    }

    private void updateBacklogStatus(Backlog backlog) {
        if (backlog.getProg() >= 100) {
            backlog.setStatus("Completed");
        } else if (backlog.getProg() > 0) {
            backlog.setStatus("In Progress");
        } else {
            backlog.setStatus("Not Started");
        }
    }

    private float calculateCumulativeActEffort(int backlogId, float newActEffort) {
        List<DailyReport> dailyReports = dailyReportRepository.findByBacklogId(backlogId);
        float cumulativeActEffort = dailyReports.stream()
                .map(DailyReport::getActEffort)
                .reduce(0f, Float::sum);

        return cumulativeActEffort + newActEffort;
    }

    private float calculateCumulativeAddEffort(int backlogId, float newAddEffort) {
        List<DailyReport> dailyReports = dailyReportRepository.findByBacklogId(backlogId);
        float cumulativeAddEffort = dailyReports.stream()
                .map(DailyReport::getAddEffort)
                .reduce(0f, Float::sum);

        return cumulativeAddEffort + newAddEffort;
    }

    private Project findProjectById(int projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    private Sprint findSprintById(int sprintId) {
        return sprintRepository.findById(sprintId)
                .orElseThrow(() -> new EntityNotFoundException("Sprint not found"));
    }

    private Backlog findBacklogById(int backlogId) {
        return backlogRepository.findById(backlogId)
                .orElseThrow(() -> new EntityNotFoundException("Backlog not found"));
    }

    private User findUserById(int userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private DailyReportResponseDTO convertToDTO(DailyReport dailyReport) {
        DailyReportResponseDTO dto = modelMapper.map(dailyReport, DailyReportResponseDTO.class);
        dto.setDailyReportId(dailyReport.getId());
        dto.setUserName(dailyReport.getUser().getName());
        dto.setBacklogCode(dailyReport.getBacklog().getCode());
        dto.setBacklogName(dailyReport.getBacklog().getName());
        dto.setProjectName(dailyReport.getProject().getName());
        dto.setSprintName(dailyReport.getSprint().getName());
        return dto;
    }
}
