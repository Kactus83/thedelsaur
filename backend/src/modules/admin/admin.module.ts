import { Router } from 'express';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import adminRoutes from './routes/admin.routes';

export class AdminModule {
  public router: Router;
  private adminService: AdminService;
  private adminController: AdminController;

  constructor() {
    this.adminService = new AdminService();
    this.adminController = new AdminController(this.adminService);
    this.router = adminRoutes(this.adminController);
  }
}
