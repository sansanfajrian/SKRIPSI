package com.skripsi.backend.controller;
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

import com.skripsi.backend.dto.ShiftDTO;
import com.skripsi.backend.service.ShiftService;


@RestController
@CrossOrigin("*")
@RequestMapping("/shifts")
public class ShiftController {
    @Autowired
    private ShiftService shiftService;

    @GetMapping
    ResponseEntity<List<ShiftDTO>> getAllShift(Pageable page) {
        List<ShiftDTO> getAllShifts = shiftService.getAllShift(page);
        return ResponseEntity.ok(getAllShifts);
    }

    @PostMapping
    ResponseEntity <ShiftDTO> createShift(@RequestBody ShiftDTO shiftDTO){
        ShiftDTO createShift = shiftService.createShift(shiftDTO);
        return ResponseEntity.ok(createShift);
    }

    @GetMapping("/{id}")
    ResponseEntity<ShiftDTO> get(@PathVariable("id") UUID id) {
        ShiftDTO getShift = shiftService.getShift(id);
        
        return ResponseEntity.ok(getShift);
    }

    @PutMapping("/{id}")
    ResponseEntity <ShiftDTO> editShift(@PathVariable("id") UUID id, @RequestBody ShiftDTO shiftDTO){
        ShiftDTO editShift = shiftService.editShift(id, shiftDTO);
        return ResponseEntity.ok(editShift);
    }

    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteShift(@PathVariable("id") UUID id){
        shiftService.deleteShift(id);
        return ResponseEntity.ok().build();
    }
}
