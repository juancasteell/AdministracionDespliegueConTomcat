import java.util.Scanner;

public class Servlets {

	public static void main(String[] args) {
		
            try (Scanner sc = new Scanner(System.in)) {
                System.out.println("Escribe un numero del 1 al 10: ");
                int numero1 = sc.nextInt();
                
                System.out.println("Escribe otro numero: ");
                int numero2 = sc.nextInt();
                
                int resultado = numero1 + numero2;
                
                System.out.println("Tu resultado es " + resultado);
            }
		
	}

}
