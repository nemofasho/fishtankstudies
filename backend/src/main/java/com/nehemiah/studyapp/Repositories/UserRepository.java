package com.nehemiah.studyapp.Repositories;

import com.nehemiah.studyapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

}
