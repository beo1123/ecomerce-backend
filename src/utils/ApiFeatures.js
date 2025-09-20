export class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.totalDocuments = 0; // Biến để lưu tổng số tài liệu
  }

  // 1. Pagination
  pagination(defaultLimit = 10) {
    const PAGE_LIMIT = this.queryString.limit * 1 || defaultLimit;
    let PAGE_NUMBER = this.queryString.page * 1 || 1;
    if (PAGE_NUMBER <= 0) PAGE_NUMBER = 1;
    const PAGE_SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT;

    this.mongooseQuery = this.mongooseQuery.skip(PAGE_SKIP).limit(PAGE_LIMIT);
    return this;
  }

  // 2. Filteration
  filteration() {
    let filterObj = { ...this.queryString };
    const excludedQuery = ["page", "sort", "fields", "keyword", "limit"];

    excludedQuery.forEach((ele) => delete filterObj[ele]);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);

    this.mongooseQuery = this.mongooseQuery.find(filterObj);
    return this;
  }

  // 3. Sort
  sort() {
    if (this.queryString.sort) {
      const sortedBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortedBy);
    } else {
      // Sắp xếp mặc định theo createdAt nếu không có sort
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // 4. Search
  search(searchFields = []) {
    if (this.queryString.keyword && searchFields.length > 0) {
      const searchQuery = {
        $or: searchFields.map((field) => ({
          [field]: { $regex: this.queryString.keyword, $options: "i" },
        })),
      };
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }

  // 5. Fields
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  // 6. Count total documents
  async countDocuments() {
    // Tạo một bản sao của mongooseQuery để đếm tổng số tài liệu
    const countQuery = this.mongooseQuery.model.find(this.mongooseQuery.getQuery());
    this.totalDocuments = await countQuery.countDocuments();
    return this;
  }

  // 7. Get pagination metadata
  getPaginationMetadata(defaultLimit = 10) {
    const PAGE_LIMIT = this.queryString.limit * 1 || defaultLimit;
    const PAGE_NUMBER = this.queryString.page * 1 || 1;
    const totalPages = Math.ceil(this.totalDocuments / PAGE_LIMIT);

    return {
      page: PAGE_NUMBER,
      limit: PAGE_LIMIT,
      totalPages,
      totalDocuments: this.totalDocuments,
    };
  }
}