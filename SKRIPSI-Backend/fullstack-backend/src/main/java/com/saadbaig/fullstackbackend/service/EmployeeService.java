package com.saadbaig.fullstackbackend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.saadbaig.fullstackbackend.dto.Employee.EmployeeDTO;
import com.saadbaig.fullstackbackend.dto.Employee.EmployeeRequestDTO;
import com.saadbaig.fullstackbackend.model.Employee;
import com.saadbaig.fullstackbackend.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<EmployeeDTO> getAllEmployees(Pageable pageable) {
        List<Employee> employees = employeeRepository.findAll(pageable).toList();
        return employees.stream()
                .map(employee -> modelMapper.map(employee, EmployeeDTO.class))
                .collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(UUID id) {
        Employee employee = employeeRepository.findById(id).orElse(null);
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    public EmployeeDTO createEmployee(EmployeeRequestDTO requestDTO) {
        Employee employee = convertToEntity(requestDTO);
        employee.setId(UUID.randomUUID());
        employee = employeeRepository.save(employee);
        return modelMapper.map(employee, EmployeeDTO.class);
    }

    public EmployeeDTO updateEmployee(UUID id, EmployeeRequestDTO requestDTO) {
        Employee existingEmployee = employeeRepository.findById(id).orElse(null);
        if (existingEmployee != null) {
            Employee updatedEmployee = convertToEntity(requestDTO);
            updatedEmployee.setId(id);
            updatedEmployee = employeeRepository.save(updatedEmployee);
            return modelMapper.map(updatedEmployee, EmployeeDTO.class);
        }
        return null; // or throw exception indicating employee not found
    }

    public void deleteEmployee(UUID id) {
        employeeRepository.deleteById(id);
    }

    private Employee convertToEntity(EmployeeRequestDTO requestDTO) {
        return modelMapper.map(requestDTO, Employee.class);
    }
}
