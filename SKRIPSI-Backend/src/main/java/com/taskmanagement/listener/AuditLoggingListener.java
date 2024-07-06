package com.taskmanagement.listener;

import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class AuditLoggingListener {
    private static final Marker AUDIT_MARKER = MarkerFactory.getMarker("AUDIT");

    @PostPersist
    public void postPersist(Object target) {
        log.info(AUDIT_MARKER, String.format("[AUDIT][CREATE] A new %s has been added", target.getClass().getName()));
        log.info(AUDIT_MARKER, String.format("[AUDIT][CREATE] %s", target.toString()));
    }

    @PostUpdate
    public void postUpdate(Object target) {
        log.info(AUDIT_MARKER,
                String.format("[AUDIT][UPDATE] Existing entity %s has been updated", target.getClass().getName()));
        log.info(AUDIT_MARKER, String.format("[AUDIT][UPDATE] %s", target.toString()));
    }

    @PostRemove
    public void postRemove(Object target) {
        log.info(AUDIT_MARKER,
                String.format("[AUDIT][DELETE] An entity of %s has been deleted", target.getClass().getName()));
        log.info(AUDIT_MARKER, String.format("[AUDIT][DELETE] %s", target.toString()));
    }

    // @formatter:off
    /**
     * Uncomment this function to log whenever the entity is loaded from the
     * database
     * 
     * Usage of this function could lead to big logs (tens of gigabytes per day for
     * high traffic app), only use it if necessary!
     */
    // Uncomment from below here
    // @PostLoad
    // public void postLoad(Object target) {
    //     log.info(AUDIT_MARKER, String.format("[AUDIT][READ] An entity of %s has been loaded from the database", target.getClass().getName()));
    //     log.info(AUDIT_MARKER, String.format("[AUDIT][READ] %s", target.toString()));
    // }
    // Until here, and delete lines starting with "@formatter"
    // @formatter:on
}