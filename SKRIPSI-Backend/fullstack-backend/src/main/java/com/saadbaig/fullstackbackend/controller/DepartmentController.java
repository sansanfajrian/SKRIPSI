package com.saadbaig.fullstackbackend.controller;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

import com.saadbaig.fullstackbackend.dto.DepartmentDTO;
import com.saadbaig.fullstackbackend.service.DepartmentService;


@RestController
@CrossOrigin("*")
@RequestMapping("/departments")
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    ResponseEntity<List<DepartmentDTO>> getAllDepartment(Pageable page) {
        List<DepartmentDTO> getAllDepartments = departmentService.getAllDepartment(page);
        return ResponseEntity.ok(getAllDepartments);
    }

    @PostMapping
    ResponseEntity <DepartmentDTO> createDepartment(@RequestBody DepartmentDTO departmentDTO){
        DepartmentDTO createDepartment = departmentService.createDepartment(departmentDTO);
        return ResponseEntity.ok(createDepartment);
    }

    @GetMapping("/{id}")
    ResponseEntity<DepartmentDTO> get(@PathVariable("id") UUID id) {
        DepartmentDTO getDepartment = departmentService.getDepartment(id);
        
        return ResponseEntity.ok(getDepartment);
    }

    @PutMapping("/{id}")
    ResponseEntity <DepartmentDTO> editDepartment(@PathVariable("id") UUID id, @RequestBody DepartmentDTO departmentDTO){
        DepartmentDTO editDepartment = departmentService.editDepartment(id, departmentDTO);
        return ResponseEntity.ok(editDepartment);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteDepartments(@PathVariable("id") UUID id){
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
}
