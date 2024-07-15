package com.taskmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskmanagement.dao.TeamMemberDao;
import com.taskmanagement.entity.TeamMember;

@Service
public class TeamMemberService {

    @Autowired
    private TeamMemberDao teamMemberRepository;
    

    @Transactional
    public TeamMember saveTeamMember(TeamMember teamMember) {
        return teamMemberRepository.save(teamMember);
    }

    public List<TeamMember> findByProjectId(int projectId) {
        return teamMemberRepository.findByProjectId(projectId);
    }

    @Transactional
    public void deleteTeamMember(TeamMember teamMember) {
        teamMemberRepository.delete(teamMember);
    }

    @Transactional
    public void saveAll(List<TeamMember> teamMembers) {
        teamMemberRepository.saveAll(teamMembers);
    }

    @Transactional
    public void deleteTeamMemberById(int id) {
        teamMemberRepository.deleteById(id);
    }

    @Transactional
    public void deleteAll(List<TeamMember> teamMembers) {
        teamMemberRepository.deleteAll(teamMembers);
    }

    public List<TeamMember> findByUserId(int userId) {
        return teamMemberRepository.findByUserId(userId);
    }
}