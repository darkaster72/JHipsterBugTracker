package com.mycompany.bugtracker.service;

import com.mycompany.bugtracker.domain.User;
import reactor.core.publisher.Mono;

public interface IUserService {
    Mono<User> getCurrentUser();
}
