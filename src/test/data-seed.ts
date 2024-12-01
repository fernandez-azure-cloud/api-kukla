import { AssignmentType, ProjectStatusCode, RoleCode } from 'src/shared/base';
import {
  AmountRange,
  Currency,
  Department,
  District,
  EmailTemplate,
  EmailTemplateVersion,
  Module,
  Office,
  Permission,
  Project,
  ProjectAssignment,
  Province,
  Question,
  QuestionOption,
  Region,
  Role,
  RoleModule,
  RolePermission,
  Speciality,
  User,
  UserRegion,
  UserRole,
} from 'src/shared/entities';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { EntityManager } from 'typeorm';

const modules = [
  { id: 1, name: 'Proyectos', route: 'projects' },
  { id: 2, name: 'Usuarios', route: 'users' },
];

const permissions = [
  {
    id: 1,
    code: 'list_projects',
    name: 'Listar proyectos',
    resource: 'projects',
    method: 'GET',
    module: modules[0],
  },
  {
    id: 2,
    code: 'project_detail',
    name: 'Detalle de proyecto',
    resource: 'projects/:id',
    method: 'GET',
    module: modules[0],
  },
];

const roles = [
  { id: 1, code: RoleCode.Administrator, description: 'Administrador' },
  { id: 2, code: RoleCode.Executive, description: 'Ejecutivo' },
  { id: 3, code: RoleCode.Manager, description: 'Jefe' },
];

const roleModules = [
  { roleId: 1, moduleId: 1 },
  { roleId: 1, moduleId: 2 },
];

const rolePermissions = [
  { roleId: 2, permissionId: 1 },
  { roleId: 2, permissionId: 2 },
];

const currencies = [{ id: 1, name: 'Soles', isoCode: 'PEN' }];

const amountRanges = [
  { id: 1, minAmount: 0, maxAmount: 1000, currency: currencies[0] },
  { id: 2, minAmount: 1001, maxAmount: 2000, currency: currencies[0] },
  { id: 3, minAmount: 2001, maxAmount: 3000, currency: currencies[0] },
  { id: 4, minAmount: 3001, maxAmount: 4000, currency: currencies[0] },
  { id: 5, minAmount: 4001, maxAmount: null, currency: currencies[0] },
];

const projectStatus = [
  { id: 1, description: 'No Asignado', code: ProjectStatusCode.Unassigned },
  { id: 2, description: 'Asignado', code: ProjectStatusCode.Assigned },
  { id: 3, description: 'En Progreso', code: ProjectStatusCode.InProgress },
  { id: 4, description: 'Completado', code: ProjectStatusCode.Completed },
  { id: 5, description: 'Aprobado', code: ProjectStatusCode.Approved },
  { id: 6, description: 'Observado', code: ProjectStatusCode.Observed },
  { id: 7, description: 'Enviado', code: ProjectStatusCode.Sended },
];

const regions = [
  { id: 1, name: 'Region 1' },
  { id: 2, name: 'Region 2' },
];

const offices = [
  { id: 1, name: 'Of. Trujillo', region: regions[0] },
  { id: 2, name: 'Of. Piura', region: regions[1] },
];

const users = [
  {
    id: 1,
    name: 'Sindy',
    firstSurname: 'Perez',
    lastSurname: 'Medina',
    phone: '654987456',
    email: 'sindy.perez@example.com',
    password: '123456',
    userRegions: [{ region: regions[0] }],
  },
  {
    id: 2,
    name: 'Mario',
    firstSurname: 'Figueroa',
    lastSurname: 'Espinoza',
    phone: '654987453',
    email: 'mario.figueroa@example.com',
    password: '123456',
    userRegions: [{ region: regions[1] }],
  },
  {
    id: 3,
    name: 'Graciela',
    firstSurname: 'Peña',
    lastSurname: 'Rosas',
    phone: '654789485',
    email: 'graciela.pena@example.com',
    password: '123456',
    userRegions: [{ region: regions[0] }, { region: regions[1] }],
  },
  {
    id: 4,
    name: 'Rocio',
    firstSurname: 'Alvarez',
    lastSurname: 'Luis',
    phone: '654789486',
    email: 'rocio.alvarez@example.com',
    password: '123456',
    userRegions: [{ region: regions[0] }, { region: regions[1] }],
  },
  {
    id: 5,
    name: 'Patricia',
    firstSurname: 'Aguilar',
    lastSurname: 'Melo',
    phone: '654789481',
    email: 'patricia.aguilar@example.com',
    password: '123456',
    userRegions: [{ region: regions[0] }, { region: regions[1] }],
  },
];

const userRoles = [
  { userId: 1, roleId: 2 },
  { userId: 2, roleId: 2 },
  { userId: 3, roleId: 2 },
  { userId: 4, roleId: 1 },
  { userId: 5, roleId: 3 },
];

const userRegions = [
  { user: users[0], region: regions[0] },
  { user: users[1], region: regions[0] },
  { user: users[2], region: regions[0] },
  { user: users[2], region: regions[1] },
  { user: users[4], region: regions[0] },
  { user: users[4], region: regions[1] },
];

const departments = [
  { id: 1, name: 'La Libertad' },
  { id: 2, name: 'Piura' },
];

const provinces = [
  { id: 1, name: 'Trujillo', department: departments[0] },
  { id: 2, name: 'Piura', department: departments[1] },
];

const districts = [
  { id: 1, name: 'Salaverry', province: provinces[0] },
  { id: 2, name: 'Piura', province: provinces[1] },
];

const specialities = [
  { id: 1, name: 'Infraestructura' },
  { id: 2, name: 'Industria' },
];

const projects = [
  {
    id: 1,
    name: 'Project A',
    uniqueInvestmentCode: '2077997',
    priority: 'A',
    district: districts[0],
    office: offices[0],
    viableAmount: 1847407252,
    feasibilityDate: '2010-04-05',
    updatedAmount: 3148962778,
    description: 'Proyecto de prueba A',
    lastStudyId: 1,
    feasibilityLevelId: 1,
    financialUnitId: 1,
    speciality: specialities[0],
    status: projectStatus[1],
    currency: currencies[0],
  },
  {
    id: 2,
    name: 'Project B',
    uniqueInvestmentCode: '2040186',
    priority: 'A',
    district: districts[0],
    office: offices[0],
    viableAmount: 2272300920,
    feasibilityDate: '2010-04-05',
    updatedAmount: 3331410358,
    description: 'Proyecto de prueba B',
    lastStudyId: 1,
    feasibilityLevelId: 1,
    financialUnitId: 1,
    speciality: specialities[0],
    status: projectStatus[1],
    currency: currencies[0],
  },
  {
    id: 3,
    name: 'Project C',
    uniqueInvestmentCode: '2430411',
    priority: 'A',
    district: districts[0],
    office: offices[1],
    viableAmount: 2013732521,
    feasibilityDate: '2010-04-05',
    updatedAmount: 2033837542,
    description: 'Proyecto de prueba C',
    lastStudyId: 1,
    feasibilityLevelId: 1,
    financialUnitId: 1,
    speciality: specialities[0],
    status: projectStatus[1],
    currency: currencies[0],
  },
];

const projectAssignments = [
  {
    id: 1,
    assignmentType: AssignmentType.Manual,
    project: projects[0],
    user: users[0],
    notificationId: 1,
    active: true,
  },
  {
    id: 2,
    assignmentType: AssignmentType.Manual,
    project: projects[1],
    user: users[0],
    notificationId: 1,
    active: true,
  },
  {
    id: 3,
    assignmentType: AssignmentType.Manual,
    project: projects[2],
    user: users[1],
    notificationId: 1,
    active: true,
  },
];

const questions = [
  { id: 1, text: 'Pregunta 1', type: 'select', order: 1 },
  { id: 2, text: 'Pregunta 2', type: 'select', order: 2, parentId: 1 },
];

const questionOptions = [
  { id: 1, text: 'Opcion 1', order: 1, specialityId: 1, questionId: 1 },
  { id: 2, text: 'Opcion 2', order: 2, specialityId: 1, questionId: 1 },
  { id: 3, text: 'Opcion 1', order: 3, questionId: 2, parentId: 1 },
  { id: 4, text: 'Opcion 2', order: 4, questionId: 2, parentId: 1 },
  { id: 5, text: 'Opcion 1', order: 5, questionId: 1, specialityId: 2 },
  { id: 6, text: 'Opcion 2', order: 6, questionId: 1, specialityId: 2 },
  { id: 7, text: 'Opcion 1', order: 7, questionId: 2, parentId: 2 },
  { id: 8, text: 'Opcion 2', order: 8, questionId: 2, parentId: 2 },
];

const emails = [
  { id: 1, code: 'send_project' },
  { id: 2, code: 'create_user' },
];

const emailVersions = [
  {
    emailTemplateId: 1,
    version: 1,
    subject: 'Enviado',
    text: 'Nuevo projecto enviado',
    html: 'Nuevo projecto enviado',
  },
  {
    emailTemplateId: 2,
    version: 1,
    subject: 'Hola',
    text: 'Bienvenido',
    html: 'Bienvenido',
  },
];

export const testDataSeed = async (entityManager: EntityManager) => {
  await entityManager.insert<EmailTemplate>(EmailTemplate, emails);
  await entityManager.insert<EmailTemplateVersion>(
    EmailTemplateVersion,
    emailVersions,
  );
  await entityManager.insert<Module>(Module, modules);
  await entityManager.insert<Permission>(Permission, permissions);
  await entityManager.insert<Role>(Role, roles);
  await entityManager.insert<RoleModule>(RoleModule, roleModules);
  await entityManager.insert<RolePermission>(RolePermission, rolePermissions);
  await entityManager.insert<Currency>(Currency, currencies);
  await entityManager.insert<AmountRange>(AmountRange, amountRanges);
  await entityManager.insert<ProjectStatus>(ProjectStatus, projectStatus);
  await entityManager.insert<Region>(Region, regions);
  await entityManager.insert<Office>(Office, offices);
  await entityManager.insert<User>(User, users);
  await entityManager.insert<UserRole>(UserRole, userRoles);
  await entityManager.insert<UserRegion>(UserRegion, userRegions);
  await entityManager.insert<Department>(Department, departments);
  await entityManager.insert<Province>(Province, provinces);
  await entityManager.insert<District>(District, districts);
  await entityManager.insert<Speciality>(Speciality, specialities);
  await entityManager.insert<Project>(Project, projects);
  await entityManager.insert<ProjectAssignment>(
    ProjectAssignment,
    projectAssignments,
  );
  await entityManager.insert<Question>(Question, questions);
  await entityManager.insert<QuestionOption>(QuestionOption, questionOptions);
};
