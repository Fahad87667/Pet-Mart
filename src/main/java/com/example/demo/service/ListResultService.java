package com.example.demo.service;

import jakarta.persistence.Query;
import java.util.List;

public class ListResultService<T> {
    private int page;
    private int maxResult;
    private List<T> list;
    private long totalRecords;

    @SuppressWarnings("unchecked")
    public ListResultService(int page, int maxResult, Query query, Query countQuery) {
        this.page = page;
        this.maxResult = maxResult;
        this.totalRecords = (long) countQuery.getSingleResult();
        this.list = (List<T>) query.getResultList();
    }

    public int getPage() {
        return page;
    }

    public int getMaxResult() {
        return maxResult;
    }

    public List<T> getList() {
        return list;
    }

    public long getTotalRecords() {
        return totalRecords;
    }
}
