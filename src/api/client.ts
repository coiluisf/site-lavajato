import { CreateCustomerDto, UpdateCustomerDto, CreateServiceDto, UpdateServiceDto, CreateAppointmentDto, UpdateAppointmentDto, CreateOrderDto, UpdateOrderStatusDto, CompanyStats, Revenue } from '@/types/dto';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Customers
  async fetchCustomers(companyId: number, page: number = 1, limit: number = 20): Promise<any> {
    return this.request('GET', `/companies/${companyId}/customers?page=${page}&limit=${limit}`);
  }

  async createCustomer(companyId: number, dto: CreateCustomerDto): Promise<any> {
    return this.request('POST', `/companies/${companyId}/customers`, dto);
  }

  async updateCustomer(companyId: number, customerId: number, dto: UpdateCustomerDto): Promise<any> {
    return this.request('PATCH', `/companies/${companyId}/customers/${customerId}`, dto);
  }

  async deleteCustomer(companyId: number, customerId: number): Promise<void> {
    return this.request('DELETE', `/companies/${companyId}/customers/${customerId}`);
  }

  async searchCustomers(companyId: number, query: string): Promise<any> {
    return this.request('GET', `/companies/${companyId}/customers/search?q=${query}`);
  }

  // Services
  async fetchServices(companyId: number): Promise<any> {
    return this.request('GET', `/companies/${companyId}/services`);
  }

  async createService(companyId: number, dto: CreateServiceDto): Promise<any> {
    return this.request('POST', `/companies/${companyId}/services`, dto);
  }

  async updateService(companyId: number, serviceId: number, dto: UpdateServiceDto): Promise<any> {
    return this.request('PATCH', `/companies/${companyId}/services/${serviceId}`, dto);
  }

  async deleteService(companyId: number, serviceId: number): Promise<void> {
    return this.request('DELETE', `/companies/${companyId}/services/${serviceId}`);
  }

  // Appointments
  async fetchAppointments(companyId: number, status?: string, date?: string, page?: number): Promise<any> {
    let url = `/companies/${companyId}/appointments`;
    const params = [];
    if (status) params.push(`status=${status}`);
    if (date) params.push(`date=${date}`);
    if (page) params.push(`page=${page}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.request('GET', url);
  }

  async fetchTodayAppointments(companyId: number): Promise<any> {
    return this.request('GET', `/companies/${companyId}/appointments/today`);
  }

  async createAppointment(companyId: number, dto: CreateAppointmentDto): Promise<any> {
    return this.request('POST', `/companies/${companyId}/appointments`, dto);
  }

  async updateAppointment(companyId: number, appointmentId: number, dto: UpdateAppointmentDto): Promise<any> {
    return this.request('PATCH', `/companies/${companyId}/appointments/${appointmentId}`, dto);
  }

  async updateAppointmentStatus(companyId: number, appointmentId: number, status: string): Promise<any> {
    return this.request('PATCH', `/companies/${companyId}/appointments/${appointmentId}/status`, { status });
  }

  async cancelAppointment(companyId: number, appointmentId: number): Promise<void> {
    return this.request('DELETE', `/companies/${companyId}/appointments/${appointmentId}`);
  }

  // Orders
  async fetchOrders(companyId: number, status?: string, page?: number): Promise<any> {
    let url = `/companies/${companyId}/orders`;
    const params = [];
    if (status) params.push(`status=${status}`);
    if (page) params.push(`page=${page}`);
    if (params.length > 0) url += '?' + params.join('&');
    return this.request('GET', url);
  }

  async createOrder(companyId: number, dto: CreateOrderDto): Promise<any> {
    return this.request('POST', `/companies/${companyId}/orders`, dto);
  }

  async updateOrderStatus(companyId: number, orderId: number, dto: UpdateOrderStatusDto): Promise<any> {
    return this.request('PATCH', `/companies/${companyId}/orders/${orderId}/status`, dto);
  }

  async cancelOrder(companyId: number, orderId: number): Promise<void> {
    return this.request('DELETE', `/companies/${companyId}/orders/${orderId}`);
  }

  // Analytics
  async fetchCompanyRevenue(companyId: number, days: number = 30): Promise<Revenue> {
    return this.request('GET', `/companies/${companyId}/orders/revenue?days=${days}`);
  }

  async fetchCompanyStats(companyId: number): Promise<CompanyStats> {
    return this.request('GET', `/companies/${companyId}/stats`);
  }
}

export const apiClient = new ApiClient();
