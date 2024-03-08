package com.saadbaig.fullstackbackend.service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.saadbaig.fullstackbackend.dto.ShiftDTO;
import com.saadbaig.fullstackbackend.model.Shift;
import com.saadbaig.fullstackbackend.repository.ShiftRepository;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<ShiftDTO> getAllShift(Pageable pageable) {
        List<Shift> shifts = shiftRepository.findAll(pageable).toList();
        return shifts.stream()
                .map(shift -> modelMapper.map(shift, ShiftDTO.class))
                .collect(Collectors.toList());
    }

    public ShiftDTO getShift(UUID id) {
        Shift shift = shiftRepository.findById(id).orElse(null);
        return modelMapper.map(shift, ShiftDTO.class);
    }

    public ShiftDTO createShift(ShiftDTO shiftDTO) {
        Shift shift = modelMapper.map(shiftDTO, Shift.class);
        shift.setId(UUID.randomUUID());
        shift = shiftRepository.save(shift);
        return modelMapper.map(shift, ShiftDTO.class);
    }

    public ShiftDTO editShift(UUID id, ShiftDTO shiftDTO) {
        Shift existingShift = shiftRepository.findById(id).orElse(null);
        if (existingShift != null) {
            existingShift.setStartTime(shiftDTO.getStartTime());
            existingShift.setEndTime(shiftDTO.getEndTime());
            existingShift = shiftRepository.save(existingShift);
            return modelMapper.map(existingShift, ShiftDTO.class);
        }
        return null; // or throw exception indicating shift not found
    }

    public void deleteShift(UUID id) {
        shiftRepository.deleteById(id);
    }
}