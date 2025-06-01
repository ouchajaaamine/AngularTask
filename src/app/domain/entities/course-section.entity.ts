export class CourseSection {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly resources: string[],
    public readonly order: number = 0
  ) {}

  get hasResources(): boolean {
    return this.resources.length > 0;
  }

  get resourceCount(): number {
    return this.resources.length;
  }

  addResource(resource: string): CourseSection {
    return new CourseSection(
      this.id,
      this.title,
      this.description,
      [...this.resources, resource],
      this.order
    );
  }

  removeResource(resource: string): CourseSection {
    return new CourseSection(
      this.id,
      this.title,
      this.description,
      this.resources.filter(r => r !== resource),
      this.order
    );
  }

  updateTitle(newTitle: string): CourseSection {
    return new CourseSection(
      this.id,
      newTitle,
      this.description,
      this.resources,
      this.order
    );
  }

  updateDescription(newDescription: string): CourseSection {
    return new CourseSection(
      this.id,
      this.title,
      newDescription,
      this.resources,
      this.order
    );
  }

  static create(data: {
    id: string;
    title: string;
    description: string;
    resources?: string[];
    order?: number;
  }): CourseSection {
    return new CourseSection(
      data.id,
      data.title,
      data.description,
      data.resources || [],
      data.order || 0
    );
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      resources: this.resources,
      order: this.order
    };
  }
}
