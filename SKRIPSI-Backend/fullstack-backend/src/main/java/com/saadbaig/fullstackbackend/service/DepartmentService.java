package com.saadbaig.fullstackbackend.service;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.saadbaig.fullstackbackend.dto.DepartmentDTO;
import com.saadbaig.fullstackbackend.model.Department;
import com.saadbaig.fullstackbackend.repository.DepartmentRepository;


@Service
public class DepartmentService {
    @Autowired
    DepartmentRepository departmentRepo;

    @Autowired
    ModelMapper modelMapper;

    public List<DepartmentDTO> getAllDepartment(Pageable page) {
        List<Department> departmentList = departmentRepo.findAll(page).toList();
        List<DepartmentDTO> departmentDTO = departmentList.stream().map((o)->{
            return modelMapper.map(o, DepartmentDTO.class);
        }).toList();
        return departmentDTO;
    }

    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department newDepartment = modelMapper.map(departmentDTO, Department.class);
        newDepartment.setId(UUID.randomUUID());
        newDepartment = departmentRepo.save(newDepartment);
        return modelMapper.map(newDepartment, DepartmentDTO.class);
    }

    public DepartmentDTO getDepartment(UUID id){
        Department department = departmentRepo.findById(id).orElse(null);
        return modelMapper.map(department, DepartmentDTO.class);
    }

    public DepartmentDTO editDepartment(UUID id, DepartmentDTO departmentDTO){
        Department department = departmentRepo.findById(id).orElse(null);
        if (department != null) {
            department.setName(departmentDTO.getName());
            department = departmentRepo.save(department);
        }
        return modelMapper.map(department, DepartmentDTO.class);
    }

    public void deleteDepartment(UUID id){
        departmentRepo.deleteById(id);
    }
}
