import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  StInputComponent,
  StButtonComponent,
  StSurfaceComponent,
} from '@otrocadev/orbital-spacetraders-ds';
import { SessionStore } from '../../core/session-management/session-management.store';
import { AgentStore } from '../../core/agent-management/agent-management.store';
import { AgentDetails } from '../../core/agent-management/agent-management';

@Component({
  selector: 'app-login-view',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StInputComponent,
    StButtonComponent,
    StSurfaceComponent,
  ],
  templateUrl: './login-view.html',
  styleUrl: './login-view.scss',
})
export class LoginView {
  private readonly sessionManagementStore = inject(SessionStore);
  private readonly agentStore = inject(AgentStore);
  private readonly router = inject(Router);
  private readonly _loginError = signal<string | null>(null);

  public readonly loginForm = new FormGroup({
    token: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  public get loginError(): string | null {
    return this._loginError();
  }

  public onTokenChange(value: string): void {
    this._loginError.set(null);
    this.tokenControl.setValue(value);
    this.tokenControl.markAsDirty();
  }

  public get tokenErrorText(): string {
    if (!this.tokenControl.invalid || !this.tokenControl.dirty) {
      return '';
    }

    if (this.tokenControl.hasError('required')) {
      return 'Token is required';
    }

    if (this.tokenControl.hasError('minlength')) {
      return 'Token must be at least 10 characters';
    }

    return 'Invalid token';
  }

  public login(): void {
    if (!this.loginForm.valid) {
      this.tokenControl.markAsDirty();
      return;
    }

    this._loginError.set(null);
    const token = this.tokenControl.value.trim();

    this.agentStore
      .loadAgentDetails(token)
      .subscribe((data) => this.persistTokenOnValidAgent(token, data));
  }

  private persistTokenOnValidAgent(token: string, details: AgentDetails | null): void {
    if (!details) {
      this._loginError.set(
        'It seems like this is not a valid token. Make sure it is valid and in the current server update.',
      );
      return;
    }

    this.sessionManagementStore.setToken(token);
    this.router.navigateByUrl('/ships');
  }

  private get tokenControl() {
    return this.loginForm.controls.token;
  }
}
