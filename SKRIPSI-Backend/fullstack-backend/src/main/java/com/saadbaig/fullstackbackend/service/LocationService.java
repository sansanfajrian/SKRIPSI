package com.saadbaig.fullstackbackend.service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;

import com.saadbaig.fullstackbackend.dto.LocationDTO;
import com.saadbaig.fullstackbackend.model.Location;
import com.saadbaig.fullstackbackend.repository.LocationRepository;

public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<LocationDTO> getAllLocation(Pageable pageable) {
        List<Location> locations = locationRepository.findAll(pageable).toList();
        return locations.stream()
                .map(location -> modelMapper.map(location, LocationDTO.class))
                .collect(Collectors.toList());
    }

    public LocationDTO getLocation(UUID id) {
        Location location = locationRepository.findById(id).orElse(null);
        return modelMapper.map(location, LocationDTO.class);
    }

    public LocationDTO createLocation(LocationDTO locationDTO) {
        Location location = modelMapper.map(locationDTO, Location.class);
        location.setId(UUID.randomUUID());
        location = locationRepository.save(location);
        return modelMapper.map(location, LocationDTO.class);
    }

    public LocationDTO editLocation(UUID id, LocationDTO locationDTO) {
        Location existingLocation = locationRepository.findById(id).orElse(null);
        if (existingLocation != null) {
            existingLocation.setName(locationDTO.getName());
            existingLocation = locationRepository.save(existingLocation);
            return modelMapper.map(existingLocation, LocationDTO.class);
        }
        return null; // or throw exception indicating location not found
    }

    public void deleteLocation(UUID id) {
        locationRepository.deleteById(id);
    }
}
