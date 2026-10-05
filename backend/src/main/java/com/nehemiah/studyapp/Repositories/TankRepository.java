package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.Tank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TankRepository extends JpaRepository<Tank, Long> {

    List<Tank> findByMembersId(Long userId);
}